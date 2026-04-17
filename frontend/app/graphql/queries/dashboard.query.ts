import { gql } from '@apollo/client';

export const GET_USER_TASKS = gql`
  query GetUsersTask($userId: ID!) {
    getUserTasks(userId: $userId) {
      id
      title
    }
  }
`;

export const GET_USER_ASSIGNED_TASKS = gql`
  query GetUserAssignedTasks($userId: ID!) {
    getUserAssignedTasks(userId: $userId) {
      id
      title
      dueDate
      priority
    }
  }
`;
