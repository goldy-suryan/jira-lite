'use client';

import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';
import toast from 'react-hot-toast';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
});

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => toast(`${message}`));
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => toast(message));
  } else {
    toast(`${error.message}`);
  }
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:5000/graphql',
    connectionParams: () => {
      if (typeof document === 'undefined') return {};
      const token = globalThis.document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      return { token };
    },
  }),
);

const splitLink = ApolloLink.split(
  ({ operationType }) => operationType == OperationTypeNode.SUBSCRIPTION,
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, splitLink]), // authLink.concat(httpLink) when not using subscription,
});
