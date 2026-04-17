import type { TaskController } from '../../modules/task/task.contoller.js';
import { unauthorizedError } from '../../utils/helperFunc.js';

export const taskResolver = {
  getTaskDetail(
    parent: any,
    args: any,
    { user, taskCtrl }: { user: any; taskCtrl: TaskController },
  ) {
    if (!user) {
      throw unauthorizedError();
    }
    return taskCtrl.getTaskDetail(args.id);
  },

  getUserTasks(
    parent,
    args,
    { user, taskCtrl }: { user: any; taskCtrl: TaskController },
  ) {
    if (!user) {
      return unauthorizedError();
    }
    return taskCtrl.getUserTasks(args.userId);
  },

  getUserAssignedTasks(
    parent,
    args,
    { user, taskCtrl }: { user: any; taskCtrl: TaskController },
  ) {
    if (!user) {
      return unauthorizedError();
    }
    return taskCtrl.getUserAssignedTasks(args.userId);
  },
};
