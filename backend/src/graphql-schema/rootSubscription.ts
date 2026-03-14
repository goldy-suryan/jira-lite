export const RootSubscription = `#graphql
  type Subscription {
    commentAdded(taskId: ID!): Comment
  }
`;
