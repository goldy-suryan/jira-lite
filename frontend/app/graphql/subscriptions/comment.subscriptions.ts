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
