import { CommentService } from './comment.service.js';

export class CommentController {
  private readonly commentSrvc = new CommentService();

  addComment = async (user, body) => {
    return await this.commentSrvc.addComment(user, body);
  };

  getAllTaskComments = async (taskId: string) => {
    return await this.commentSrvc.getAllTaskComments(taskId);
  };
}
