import { gql } from '@apollo/client';

export const GET_USER_PROJECTS = gql`
  query GetUserProjects($userId: ID!) {
    getUserProjects(id: $userId) {
      name
      email
      role
      projects {
        id
        name
        key
        description
        users {
          id
          name
          email
        }
        tasks {
          title
        }
      }
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: ID!) {
    getProjectById(id: $projectId) {
      name
      key
      description
      owner {
        id
        name
      }
      users {
        id
        name
      }
      tasks {
        id
        title
        description
        priority
        status
        dueDate
        position
        assigneeId
        createdBy
        projectId
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
    }
  }
`;
