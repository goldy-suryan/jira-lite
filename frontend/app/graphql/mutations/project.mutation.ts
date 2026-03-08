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
