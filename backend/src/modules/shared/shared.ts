import { Sequelize } from 'sequelize';
import { pubSub } from '../../config/pubSub.config.js';
import { AttachmentModel } from '../../models/attachment.model.js';
import { CommentModel } from '../comment/comment.model.js';

export class Shared {
  protected createAndPublishNotification = async (
    notificationCtrl,
    data,
    transaction,
  ) => {
    
    const createdNotification = await notificationCtrl.createNotification(
      {
        receiverId: data.receiverId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      },
      transaction,
    );

    await pubSub.publish(`${data.type}_${data.receiverId}`, {
      [data.subProp]: createdNotification,
    });
  };

  protected getTaskCommentAttachmentCount = async (tasks) => {
    if (!tasks?.length) return;
    const taskIds = tasks.map((task) => task.id);
    const clause = {
      where: {
        taskId: taskIds,
      },
      group: ['taskId'],
      raw: true,
    };

    const attachmentsCount = await AttachmentModel.findAll<any>({
      attributes: [
        'taskId',
        [Sequelize.fn('count', Sequelize.col('id')), 'count'],
      ],
      ...clause,
    });

    const commentCount = await CommentModel.findAll<any>({
      attributes: [
        'taskId',
        [Sequelize.fn('count', Sequelize.col('id')), 'count'],
      ],
      ...clause,
    });

    const attachmentMap = Object.fromEntries(
      attachmentsCount.map((item) => [item.taskId, Number(item.count)]),
    );

    const commentMap = Object.fromEntries(
      commentCount.map((item) => [item.taskId, Number(item.count)]),
    );

    tasks.forEach((task) => {
      task.setDataValue('attachmentsCount', attachmentMap[task.id] || 0);
      task.setDataValue('commentsCount', commentMap[task.id] || 0);
    });
  };
}
