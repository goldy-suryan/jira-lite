import cookie from 'cookie';
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';
import { schema } from './graphql-schema/schema.js';
import { authenticateToken } from './utils/validateToken.js';

export const createWebSocketServer = (httpServer: any) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer(
    {
      schema: schema,
      context: (ctx) => {
        const cookies = cookie.parse(ctx.extra.request.headers.cookie || '');
        let token;
        if (cookies?.token) {
          token = cookies.token;
          const user = token ? authenticateToken(token) : null;
          return { user };
        }

        return {};
      },
    },
    wsServer,
  );

  return wsServer;
};
