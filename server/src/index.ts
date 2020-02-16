import MasterServer from '../../game/server/class/MasterServer';

async function start(): Promise<void> {
    const server: MasterServer = new MasterServer();
    await server.initialize();
    server.open(3000);
}

start();