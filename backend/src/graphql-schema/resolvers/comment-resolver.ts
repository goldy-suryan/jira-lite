import type { CommentController } from '../../modules/comment/comment.controller.js';
import { unauthorizedError } from '../../utils/helperFunc.js';

export const commentResolver = {
  getAllTaskComments: (parent, args, { user, commentCtrl }: { user: any, commentCtrl: CommentController}) => {
    if (!user) {
      throw unauthorizedError();
    }
    return commentCtrl.getAllTaskComments(args.taskId);
  },
};
