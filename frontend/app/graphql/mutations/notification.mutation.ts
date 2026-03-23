import { gql } from '@apollo/client';

export const Mark_AS_READ = gql`
  mutation MarkAsRead($notiId: ID!) {
    markAsRead(notiId: $notiId)
  }
`;
