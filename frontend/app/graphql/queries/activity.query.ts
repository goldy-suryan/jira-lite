import { gql } from "@apollo/client";

export const GET_ALL_TASK_ACTIVITY = gql`
  query GetAllTaskActivity ($taskId: ID!) {
    getAllTaskActivity(taskId: $taskId) {
      taskId
      action
    }
  }
`;