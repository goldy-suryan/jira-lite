import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError } from 'sequelize';
import { schema } from './graphql-schema/schema.js';
import { ProjectController } from './modules/project/project.controller.js';
import { TaskController } from './modules/task/task.contoller.js';
import { UserRoute } from './modules/user/user.route.js';
import { unauthorizedError } from './utils/helperFunc.js';
import { authenticateToken } from './utils/validateToken.js';
import { InvitationController } from './modules/invitation/invitation.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class App {
  app: Application;
  server: ApolloServer;
  private readonly loggingFile = fs.createWriteStream(
    path.join(__dirname, '..', 'access.log'),
  );
  private readonly userRoute: UserRoute;

  constructor() {
    this.app = express();
    this.server = new ApolloServer({
      schema,
      formatError: (formattedError, error) => {
        return { message: formattedError.message, error };
      },
    });
    this.userRoute = new UserRoute();
  }

  async initializeMiddleware() {
    await this.server.start();
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      }),
    );
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(morgan('combined', { stream: this.loggingFile }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    // Registering routes
    this.app.use('/auth', this.userRoute.router);

    // Graphql Routes
    this.app.use(
      '/graphql',
      express.json(),
      expressMiddleware(this.server, {
        context: async ({ req }) => {
          const authHeader = req.cookies.token;
          if (authHeader) {
            const user = authenticateToken(authHeader) as any;
            return {
              user,
              projectCtrl: new ProjectController(),
              taskCtrl: new TaskController(),
              invitationCtrl: new InvitationController(),
            };
          }
          throw unauthorizedError();
        },
      }),
    );

    // Global error handler
    this.app.use(
      (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof ValidationError) {
          return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors.map((e) => ({
              field: e.path,
              error: e.message,
            })),
          });
        }
        if (err instanceof Error) {
          return res.status(500).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal server error' });
      },
    );
  }
}
