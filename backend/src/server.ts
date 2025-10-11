import 'dotenv/config';
import { App } from './app';
import { DBConfig } from './config/sequelize.init';

class Server {
  private readonly app: App;
  private readonly db = new DBConfig();

  constructor() {
    this.app = new App();
  }

  async runServer() {
    await this.db.connectDB();
    await this.app.initializeMiddleware();
    this.app.app.listen(Number(process.env.PORT), '0.0.0.0', (err) => {
      if (err) {
        console.log('Something went wrong while running server');
        process.exit(1);
      }
      console.log('Server listening');
    });
  }
}

async function bootstrap() {
  const server = new Server();
  await server.runServer();
}

await bootstrap();
