import { ActivityModel } from './activity.model.js';

export class ActivityService {
  getAllTaskActivity = async (taskId: string) => {
    return await ActivityModel.findAll({
      where: {
        taskId,
      },
    });
  };
}
