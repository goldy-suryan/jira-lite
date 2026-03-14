import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';
import { RootMutation } from './rootMutation.js';
import { RootQuery } from './rootQuery.js';
import { RootSubscription } from './rootSubscription.js';
import { typeDefs } from './typeDef.js';

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs, RootQuery, RootMutation, RootSubscription],
  resolvers,
});
