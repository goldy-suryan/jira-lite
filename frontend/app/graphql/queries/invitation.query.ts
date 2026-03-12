import { gql } from '@apollo/client';

export const GET_INVITATION = gql`
  query GetInvitation($token: String!) {
    getInvitation(token: $token) {
      email
      status
      projectId
      project {
        name
      }
      invitedByUser {
        name
      }
    }
  }
`;
