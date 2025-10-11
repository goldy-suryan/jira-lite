import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDef';
import { resolvers } from './resolvers';
import { RootQuery } from './rootQuery';
import { RootMutation } from './rootMutation';

export const schema = makeExecutableSchema({
  typeDefs: [typeDefs, RootQuery, RootMutation],
  resolvers,
});
