import { DBConfig } from '../../config/sequelize.init.js';
import { CommentService } from './comment.service.js';

export class CommentController {
  private readonly commentSrvc = new CommentService();

  addComment = async (user, body, notificationCtrl) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      return await this.commentSrvc.addComment(user, body, notificationCtrl, transaction);
    });
  };

  getAllTaskComments = async (taskId: string) => {
    return await this.commentSrvc.getAllTaskComments(taskId);
  };
}
