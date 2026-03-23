import { NotificationService } from './notification.service.js';

export class NotificationController {
  private readonly notiSrvc = new NotificationService();

  getAllUserNotification = async (userId: string) => {
    return await this.notiSrvc.getAllUserNotificaton(userId);
  };

  markAsRead = async (id: string) => {
    return await this.notiSrvc.markAsRead(id);
  };
}
