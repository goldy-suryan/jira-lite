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

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: taskInput) {
    updateTask(id: $id, input: $input)
  }
`;

export const UPDATE_TASK_STATUS_POSITION = gql`
  mutation UpdateTaskStatusPosition($id: ID!, $input: taskStatusPositionInput) {
    updateTaskStatusPosition(id: $id, input: $input)
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: ID!, $message: String!) {
    addComment(taskId: $taskId, message: $message) {
      id
      message
      user {
        id
        name
        email
      }
      createdAt
    }
  }
`;
