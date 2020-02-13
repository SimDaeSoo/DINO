import SocketIO from 'socket.io-client';
import Dictionary from '../../union/interface/Dictionary';
import SocketServerData from '../../union/interface/SocketServerData';

export default class GameClient {
    private socket!: SocketIOClient.Socket;
    private callback: Dictionary<Function> = {};
    public servers: Array<SocketServerData> = [];

    public connect(url: string, callback: Dictionary<Function>): SocketIOClient.Socket {
        this.socket = SocketIO(url);
        this.callback = callback;

        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('disconnect', this.disconnected.bind(this));
        return this.socket;
    }

    public setMasterListener(): void {
        this.socket.on('notifyServers', (data: { servers: Array<SocketServerData> }): void => {
            this.servers = data.servers;
            if (this.callback.setServers) {
                this.callback.setServers(this.servers);
            }
        });
    }

    public disconnect(): void {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket.close();
    }

    private connected(): void {
        // Renderer 새로 만든다.
        if (this.callback.connect) this.callback.connect();
    }

    private disconnected(): void {
        // Renderer 부순다.
        if (this.callback.disconnect) this.callback.disconnect();
    }
}