import { GraphQLError } from 'graphql';

export function unauthorizedError() {
  return new GraphQLError('Unauthorized', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
