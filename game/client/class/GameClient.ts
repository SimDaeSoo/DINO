import SocketIO from 'socket.io-client';

export default class GameClient {
    constructor() {
        SocketIO('http://localhost:1234/');
    }
}