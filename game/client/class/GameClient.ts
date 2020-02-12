import SocketIO from 'socket.io-client';
import Dictionary from '../../union/interface/Dictionary';

export default class GameClient {
    private displayName!: string;
    private socket!: SocketIOClient.Socket;
    private callback: Dictionary<Function> = {};

    public connect(url: string, callback?: Dictionary<Function>): SocketIOClient.Socket {
        this.socket = SocketIO(url);
        this.callback = callback;

        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('disconnect', this.disconnected.bind(this));
        this.socket.on('login', this.login.bind(this));
        return this.socket;
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public tryLogin(id: string): void {
        this.socket.emit('login', id);
    }

    private login(displayName: string): void {
        // 성공 시 RoomData 계속 가져온다.
        this.displayName = displayName;
        if (this.callback.login) this.callback.login();
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