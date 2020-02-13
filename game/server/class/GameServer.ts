import * as express from 'express';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import { Error } from '../interface/Server';
import Updater from '../../union/class/Updater';
import Network from '../../union/class/Network';

class GameServer {
    private IP!: string;
    private port!: number;
    private server!: Server;
    private updater!: Updater;

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
    }

    public open(port: number): void {
        this.port = port;
        this.server = express().listen(this.port);

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
            Network.post(`http://${address}/apply`, {
                address: `http://${this.IP}:${this.port}`,
                // Rooms 는 Test
                rooms: [
                    { name: '1 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '2 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '3 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '4 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '5 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '6 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '7 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '8 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '9 Room', address: `http://${this.IP}:${this.port}` },
                    { name: '10 Room', address: `http://${this.IP}:${this.port}` }
                ]
            });
        });
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
        socket.on('disconnect', (): void => { this.disconnect(socket); });
    }

    private disconnect(socket: SocketIO.Socket): void {
        console.log(socket.id, 'disconnected');
    }

    public close(): void {
        this.server.close();
    }
}

export default GameServer;