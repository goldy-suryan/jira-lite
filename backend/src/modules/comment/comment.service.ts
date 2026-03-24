import { COMMENT_ADDED, pubSub } from '../../config/pubSub.config.js';
import type { NotificationController } from '../notification/notification.controller.js';
import { Shared } from '../shared/shared.js';
import { TaskModel } from '../task/task.model.js';
import { UserModel } from '../user/user.model.js';
import { CommentModel } from './comment.model.js';

export class CommentService extends Shared {
  addComment = async (
    user,
    body,
    notificationCtrl: NotificationController,
    transaction,
  ) => {
    const comment = await CommentModel.create<any>({
      userId: user.id,
      taskId: body.taskId,
      message: body.message,
    }, { transaction });
    const fullComment = await CommentModel.findByPk(comment.id, {
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
      transaction
    });

    const task = await TaskModel.findByPk<any>(body.taskId, { transaction });

    const id = task.assigneeId == user.id ? task.createdBy : task.assigneeId;
    const payload = {
      receiverId: id,
      type: COMMENT_ADDED,
      title: 'New Comment',
      message: `${user.name} commented on "${task.title}"`,
      subProp: 'commentNotification',
      metadata: {
        userId: task.assigneeId,
        projectId: task.projectId,
        createdBy: user.id,
        taskId: task.id,
      },
    };
    await this.createAndPublishNotification(
      notificationCtrl,
      payload,
      transaction,
    );

    await pubSub.publish(`${COMMENT_ADDED}_${body.taskId}`, {
      commentAdded: fullComment,
    });
    return fullComment;
  };

  getAllTaskComments = async (taskId: string) => {
    const commentList = await CommentModel.findAll({
      where: {
        taskId,
      },
      include: [{ model: UserModel, as: 'user' }],
    });
    return commentList;
  };
}
