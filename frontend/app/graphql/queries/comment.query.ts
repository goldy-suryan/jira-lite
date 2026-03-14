import { gql } from '@apollo/client';

export const GET_ALL_TASK_COMMENTS = gql`
  query GetAllTaskComments($taskId: ID!) {
    getAllTaskComments(taskId: $taskId) {
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
