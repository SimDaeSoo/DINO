import { Express, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import { Error } from '../interface/Server';
import Dictionary from '../../union/interface/Dictionary';
import SocketServerData from '../../union/interface/SocketServerData';
import Updater from '../../union/class/Updater';
import Network from '../../union/class/Network';

class MasterServer {
    private IP!: string;
    private server!: Server;
    private io!: SocketIO.Server;
    private application!: Express;
    private socketServerDictionary: Dictionary<SocketServerData> = {};

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
        this.application = express();
        this.middleware();
        this.routing();

        const updater: Updater = new Updater();
        updater.on('notifyServers', 2000, (): void => {
            if (this.io) {
                this.io.emit('notifyServers', { servers: this.socketServers });
            }
        });
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
        this.application.post('/apply', this.applyServer.bind(this));
    }

    public open(port: number): void {
        this.server = this.application.listen(port);

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

    private createSocketServer(): void {
        try {
            this.io = SocketIO(this.server, { serveClient: false });
            this.io.on('connection', (socket: SocketIO.Socket): void => { this.connection(socket); });
        } catch (error) {
            console.log(error);
        }
    }

    private connection(socket: SocketIO.Socket): void {
        console.log(socket.id, 'connected');
        socket.on('disconnect', (): void => { this.disconnect(socket); });
        socket.on('createRoom', (name: string): void => { this.createRoom(socket, name); });
    }

    private disconnect(socket: SocketIO.Socket): void {
        console.log(socket.id, 'disconnected');
    }

    private async createRoom(socket: SocketIO.Socket, name: string): Promise<void> {
        const lowestServer: SocketServerData = this.getLowestSocketServer();
        const createResult = await Network.post(`http://${lowestServer.address}/createRoom`, { name });
        socket.emit('join', createResult)
    }

    private getLowestSocketServer(): SocketServerData {
        let result: SocketServerData;

        for (let address in this.socketServerDictionary) {
            const serverData: SocketServerData = this.socketServerDictionary[address];

            if (!result || serverData.rooms.length < result.rooms.length) {
                result = serverData;
            }
        }

        return result;
    }

    public close(): void {
        this.server.close();
    }

    private get socketServers(): Array<SocketServerData> {
        const socketServers: Array<SocketServerData> = [];

        for (let address in this.socketServerDictionary) {
            const socketServerData: SocketServerData = this.socketServerDictionary[address];

            if (socketServerData.updated <= Date.now() - 4000) {
                delete this.socketServerDictionary[address];
            }

            socketServers.push(socketServerData);
        }

        return socketServers;
    }

    private applyServer(request: Request, response: Response, next: NextFunction): void {
        const socketData: SocketServerData = request.body;
        socketData.updated = Date.now();
        this.socketServerDictionary[socketData.address] = socketData;
        response.json({ success: true });
    }
}

export default MasterServer;