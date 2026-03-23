import type { NotificationController } from '../../modules/notification/notification.controller.js';

export const notificationResolver = {
  getAllUserNotification(
    parent,
    args,
    {
      user,
      notificationCtrl,
    }: { user: any; notificationCtrl: NotificationController },
  ) {
    return notificationCtrl.getAllUserNotification(user.id);
  },
};
