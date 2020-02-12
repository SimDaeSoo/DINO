import * as express from 'express';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import { RoomManager } from './RoomManager';
import { Room } from './Room';
import Dictionary from '../../union/interface/Dictionary';
// import axios from 'axios';

enum STATUS_CODE {
    WAIT,
    PLAY
}
interface User {
    socket: SocketIO.Socket;
    id: string;
    displayName: string;
    room?: Room;
    status: STATUS_CODE;
}
interface Error { code: string; }
class GameServer {
    private IP!: string;
    private server!: Server;
    private roomManager!: RoomManager;
    private socketDictionary: Dictionary<User> = {};

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
        this.roomManager = new RoomManager();
    }

    public open(port: number): void {
        this.server = express().listen(port);

        this.server.once('error', (err: Error): void => {
            if (err.code === 'EADDRINUSE') {
                this.close();
                this.open(++port);
            }
        });

        this.server.once('listening', (): void => {
            console.log(`server is running http://${this.IP}:${port}`);
            this.createSocketServer();
        });
    }

    public close(): void {
        this.server.close();
    }

    private createSocketServer(): void {
        try {
            const socketServer: SocketIO.Server = SocketIO(this.server, { serveClient: false });
            socketServer.on('connection', (socket: SocketIO.Socket): void => { this.connection(socket); });
        } catch (error) {
            console.log(error);
        }
    }

    private connection(socket: SocketIO.Socket): void {
        console.log(socket.id, 'connected');
        this.socketDictionary[socket.id] = { id: socket.id, socket: socket, displayName: socket.id, status: STATUS_CODE.WAIT };
        socket.on('login', (id: string): void => { this.login(socket, id); });
        socket.on('disconnect', (): void => { this.disconnect(socket); });
    }

    private disconnect(socket: SocketIO.Socket): void {
        console.log(socket.id, 'disconnected');
        delete this.socketDictionary[socket.id];
        this.roomManager.disconnect(socket);
    }

    private login(socket: SocketIO.Socket, id: string): void {
        this.socketDictionary[socket.id].displayName = id;
        socket.emit('login', id);
        console.log(this.socketDictionary);
    }
}

export default GameServer;