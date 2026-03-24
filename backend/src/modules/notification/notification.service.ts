import { UserModel } from '../user/user.model.js';
import { NotificationModel } from './notification.model.js';

export class NotificationService {
  createNotification = async (body, transaction = null) => {
    return await NotificationModel.create(body, { transaction });
  }


  getAllUserNotificaton = async (userId: string) => {
    return await NotificationModel.findAll({
      where: { receiverId: userId },
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });
  };

  markAsRead = async (id: string) => {
    const [updated] = await NotificationModel.update(
      {
        isRead: true,
      },
      {
        where: {
          id,
        },
      },
    );

    return updated > 0;
  };
}
