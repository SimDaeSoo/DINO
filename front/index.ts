import { Express } from 'express';
import * as express from 'express';

const server: Express = express();
server.use(express.static('../client/dist'));
server.listen(80);