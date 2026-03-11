import { gql } from '@apollo/client';

export const GET_TASK = gql`
  query GetTask($taskId: ID!) {
    getTaskDetail(id: $taskId) {
      id
      title
      status
      priority
      dueDate
      createdAt
      assignee {
        name
      }
      reporter {
        name
      }
      project {
        key
      }
    }
  }
`;
