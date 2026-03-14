import { COMMENT_ADDED, pubSub } from '../../config/pubSub.config.js';
import { UserModel } from '../user/user.model.js';
import { CommentModel } from './comment.model.js';

export class CommentService {
  addComment = async (user, body) => {
    let comment = await CommentModel.create<any>({
      userId: user.id,
      taskId: body.taskId,
      message: body.message,
    });
    const fullComment = await CommentModel.findByPk(comment.id, {
      include: [
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });

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
    console.log(commentList, 'comment list', taskId);
    return commentList;
  };
}
