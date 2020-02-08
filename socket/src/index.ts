import GameServer from '../../game/server/class/GameServer';

const server: GameServer = new GameServer();
server.initialize();
server.open(1234);