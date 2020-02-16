import GameServer from '../../game/server/class/GameServer';

async function start(): Promise<void> {
    const server: GameServer = new GameServer();
    await server.initialize();
    server.open(2000);
    server.connectMaster(`localhost:3000`);
}

start();