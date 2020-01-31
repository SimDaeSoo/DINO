import { NextFunction, Request, Response, Express } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import axios from 'axios';
import { RoomManager } from './RoomManager';
import { Room } from './Room';

// 서버 친구들도 Any타입 제거하기 해야함.
class GameServer {
    private IP: string;
    private application: Express;
    private server: Server;
    private socket: SocketIO.Server;
    private roomManager: RoomManager;

    public async initialize(): Promise<void> {
        this.application = express();
        this.IP = await ip.v4();
        this.middleware();
        this.routes();
        this.roomManager = new RoomManager();
    }

    public open(port: number): void {
        this.server = this.application.listen(port);
        this.server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                port++;
                this.close();
                this.open(port);
            }
        });
        this.server.once('listening', () => {
            console.log(`server is running http://${this.IP}:${port}`);
            this.createSocketServer();
        });
    }

    public close(): void {
        this.server.close();
    }

    private middleware(): void {
        this.application.use(bodyParser.json({ limit: '10mb' }));
        this.application.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));

        // CORS 문제.
        this.application.all('*', (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'POST,GET');
            next();
        });
    }

    private routes(): void {
    }

    private createSocketServer(): void {
        try {
            this.socket = SocketIO(this.server, { serveClient: false });
            this.socket.on('connection', (socket: SocketIO.Socket): void => { this.connection(socket); });
        } catch (error) {
            console.log(error);
        }
    }

    private connection(socket: SocketIO.Socket): void {
        const room: Room = this.roomManager.autoMapping(socket);

        // socket.on('broadcast', (message: string, date: number): void => { this.broadcast(socket, room, message, date); });
        socket.on('disconnect', (): void => { this.disconnect(socket, room); });
    }

    private disconnect(socket: SocketIO.Socket, room: Room): void {
        // const command = {
        //     script: 'deleteCharacter',
        //     data: { id: socket.id, objectType: 'characters' }
        // };
        // this.broadcast(socket, room, JSON.stringify(command));

        this.roomManager.disconnect(socket);
    }

    private broadcast(socket: SocketIO.Socket, room: Room, message: string): void {
        this.socket.in(room.name).emit('broadcast', message);
        // const command: any = JSON.parse(message);
    }
}

export default GameServer;