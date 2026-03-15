import type { ActivityController } from '../../modules/activity/activity.controller.js';
import { unauthorizedError } from '../../utils/helperFunc.js';

export const activityResolver = {
  getAllTaskActivity(
    parent,
    args,
    { user, activityCtrl }: { user: any; activityCtrl: ActivityController },
  ) {
    if (!user) {
      return unauthorizedError();
    }
    return activityCtrl.getAllTaskActivity(args.taskId);
  },
};
