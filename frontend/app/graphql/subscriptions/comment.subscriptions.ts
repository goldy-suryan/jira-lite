import { gql } from '@apollo/client';

export const COMMENT_ADDED = gql`
  subscription CommentAdded($taskId: ID!) {
    commentAdded(taskId: $taskId) {
      id
      message
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;

export const TASK_ASSIGNED = gql`
  subscription TaskAssigned($userId: ID!) {
    taskAssigned(userId: $userId) {
      id
      user {
        id
        name
      }
      type
      title
      message
      isRead
      metadata
      createdAt
    }
  }
`;
