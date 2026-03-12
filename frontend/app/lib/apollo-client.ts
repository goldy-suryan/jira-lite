'use client';

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
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

const authLink = new SetContextLink(({ headers }, operation) => {
  let token: string | null = null;
  const isBrowser = () => typeof globalThis !== 'undefined';
  if (isBrowser()) {
    token = localStorage.getItem('token');
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const splitLink = ApolloLink.split(
  ({ operationType }) => operationType == OperationTypeNode.SUBSCRIPTION,
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink), // authLink.concat(httpLink) when not using subscription,
});
