import 'dotenv/config';
import { App } from './app.js';
import { DBConfig } from './config/sequelize.init.js';
import http from 'node:http';
import { createWebSocketServer } from './webSocket.js';
import './models/index.js';

class Server {
  private readonly app: App;
  private readonly db = new DBConfig();
  private readonly port = Number(process.env.PORT);

  constructor() {
    this.app = new App();
  }

  async runServer() {
    await this.db.connectDB();
    await this.app.initializeMiddleware();
    const httpServer = http.createServer(this.app.app);

    createWebSocketServer(httpServer);

    httpServer.listen(this.port, () => {
      console.log(`HTTP: http://localhost:${this.port}/graphql`);
      console.log(`WS: ws://localhost:${this.port}/graphql`);
    });
  }
}

async function bootstrap() {
  const server = new Server();
  await server.runServer();
}

await bootstrap();
