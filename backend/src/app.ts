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
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError } from 'sequelize';
import winston from 'winston';
import { schema } from './graphql-schema/schema.js';
import { ActivityController } from './modules/activity/activity.controller.js';
import { CommentController } from './modules/comment/comment.controller.js';
import { InvitationController } from './modules/invitation/invitation.controller.js';
import { NotificationController } from './modules/notification/notification.controller.js';
import { ProjectController } from './modules/project/project.controller.js';
import { TaskController } from './modules/task/task.contoller.js';
import { UserRoute } from './modules/user/user.route.js';
import { unauthorizedError } from './utils/helperFunc.js';
import { authenticateToken } from './utils/validateToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class App {
  app: Application;
  server: ApolloServer;
  private readonly logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(__dirname, '..', 'access.log'),
      }),
    ],
  });
  private readonly userRoute: UserRoute;

  constructor() {
    const logger = this.logger;
    this.app = express();
    this.server = new ApolloServer({
      schema,
      introspection: true,
      formatError: (formattedError, error) => {
        return { message: formattedError.message, error };
      },
      plugins: [
        {
          async requestDidStart(requestContext) {
            const startTime = Date.now();
            const { request } = requestContext;

            return {
              async willSendResponse(ctx) {
                const duration = Date.now() - startTime;

                logger.info({
                  type: 'GRAPHQL_REQUEST',
                  query: request.query,
                  user: ctx.contextValue?.['user'],
                  variables: request.variables,
                  duration: `${duration}ms`,
                });
              },
              async didEncounterErrors(ctx) {
                logger.error({
                  type: 'GRAPHQL_ERRORS',
                  query: request.query,
                  error: ctx.errors,
                  variables: request.variables,
                  user: ctx.contextValue?.['user'],
                });
              },
            };
          },
        },
      ],
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
              commentCtrl: new CommentController(),
              activityCtrl: new ActivityController(),
              notificationCtrl: new NotificationController(),
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
