import { gql } from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql`
  query GetAllUserNotifications {
    getAllUserNotification {
      id
      type
      title
      message
      isRead
      metadata
      createdAt
    }
  }
`;
