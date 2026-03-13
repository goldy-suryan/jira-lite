import { gql } from '@apollo/client';

export const SEND_INVITATION = gql`
  mutation SendInvitation($projectId: ID!, $email: String!) {
    sendProjectInvitation(projectId: $projectId, email: $email)
  }
`;

export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($token: String!, $status: String!) {
    invitationResponse(token: $token, status: $status)
  }
`;
