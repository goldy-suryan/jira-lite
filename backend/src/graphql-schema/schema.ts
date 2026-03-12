import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDef.js';
import { RootQuery } from './rootQuery.js';
import { RootMutation } from './rootMutation.js';
import { resolvers } from './resolvers.js';

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs, RootQuery, RootMutation],
  resolvers,
});
