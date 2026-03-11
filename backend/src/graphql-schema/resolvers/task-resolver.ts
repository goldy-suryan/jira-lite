import type { TaskController } from '../../modules/task/task.contoller';
import { unauthorizedError } from '../../utils/helperFunc';

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
};
