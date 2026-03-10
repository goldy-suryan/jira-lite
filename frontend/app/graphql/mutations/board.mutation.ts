import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: createProjectInput) {
    createProject(input: $input) {
      name
      key
      description
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: taskInput) {
    createTask(input: $input) {
      title
      description
      status
      priority
      projectId
      createdBy
      assigneeId
      dueDate
      position
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;
