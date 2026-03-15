import { ActivityService } from './activity.service.js';

export class ActivityController {
  private readonly activitySrvc = new ActivityService();

  getAllTaskActivity = async (taskId: string) => {
    return await this.activitySrvc.getAllTaskActivity(taskId);
  }
}
