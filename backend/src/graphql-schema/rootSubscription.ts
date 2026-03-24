export const RootSubscription = `#graphql
  type Subscription {
    commentAdded(taskId: ID!): Comment
    taskAssigned(userId: ID!): Notification
    commentNotification(userId: ID!): Notification
  }
`;
