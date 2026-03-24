import { NotificationService } from './notification.service.js';

export class NotificationController {
  private readonly notiSrvc = new NotificationService();

  createNotification = async (body, transaction = null) => {
    return await this.notiSrvc.createNotification(body, transaction);
  };

  getAllUserNotification = async (userId: string) => {
    return await this.notiSrvc.getAllUserNotificaton(userId);
  };

  markAsRead = async (id: string) => {
    return await this.notiSrvc.markAsRead(id);
  };
}
