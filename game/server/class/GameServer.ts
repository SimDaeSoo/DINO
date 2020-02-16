import { Express, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import { Error } from '../interface/Server';
import { Room } from './Room';
import { RoomManager } from './RoomManager';
import Updater from '../../union/class/Updater';
import Network from '../../union/class/Network';
import { RoomData } from '../../union/interface/RoomData';

class GameServer {
    private IP!: string;
    private port!: number;
    private server!: Server;
    private io!: SocketIO.Server;
    private application!: Express;
    private updater!: Updater;
    private roomManager: RoomManager = new RoomManager();

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
        // this.IP = 'localhost'; //Local Test
        this.application = express();
        this.middleware();
        this.routing();
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

    private routing(): void {
        this.application.post('/createRoom', this.createRoom.bind(this))
    }

    private createRoom(request: Request, response: Response, next: NextFunction): void {
        const name: string = request.body.name;
        const id: number = request.body.id;
        const newRoom: Room = this.roomManager.createRoom({ name, id });

        response.json({
            success: true,
            address: `http://${this.IP}:${this.port}`,
            roomName: newRoom.name,
        });
    }

    public open(port: number): void {
        this.port = port;
        this.server = this.application.listen(this.port);

        this.server.once('error', (err: Error): void => {
            if (err.code === 'EADDRINUSE') {
                this.close();
                this.open(++this.port);
            }
        });

        this.server.once('listening', (): void => {
            console.log(`server is running http://${this.IP}:${this.port}`);
            this.createSocketServer();
        });
    }

    public connectMaster(address: string): void {
        if (this.updater) this.updater.removeAll();
        if (!this.updater) this.updater = new Updater();

        this.updater.on('apply', 1000, (): void => {
            const rooms: Array<RoomData> = this.roomManager.rooms.map((room: Room): RoomData => {
                return Object.assign(room.roomData, { address: `${this.IP}:${this.port}` });
            });
            Network.post(`http://${address}/apply`, {
                address: `${this.IP}:${this.port}`,
                rooms: rooms
            });
        });
    }

    private createSocketServer(): void {
        try {
            this.io = SocketIO(this.server, { serveClient: false });
            this.io.on('connection', (socket: SocketIO.Socket): void => { this.connection(socket); });
            this.roomManager.io = this.io;
        } catch (error) {
            console.log(error);
        }
    }

    private join(socket: SocketIO.Socket, roomName: string, displayName: string): void {
        const joinSuccess: boolean = this.roomManager.joinRoom(socket, roomName, displayName);
        if (!joinSuccess) {
            socket.disconnect(true);
        }
    }

    private connection(socket: SocketIO.Socket): void {
        console.log(socket.id, 'connected');
        socket.on('disconnect', (): void => { this.disconnect(socket); });
        socket.on('join', (data: { roomName: string, displayName: string }): void => { this.join(socket, data.roomName, data.displayName); });
    }

    private disconnect(socket: SocketIO.Socket): void {
        console.log(socket.id, 'disconnected');
        this.roomManager.disconnect(socket);
    }

    public close(): void {
        this.server.close();
    }
}

export default GameServer;