import GameServer from '../../game/server/class/GameServer';

async function start(): Promise<void> {
    const server: GameServer = new GameServer();
    await server.initialize();
    server.open(1234);
}

start();