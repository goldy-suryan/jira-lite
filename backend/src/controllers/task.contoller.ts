import { TaskService } from '../services/task.service';

export class TaskController {
  private readonly taskSrvc = new TaskService();

  getTaskDetail = async (id: string) => {
    return await this.taskSrvc.getTaskDetail(id);
  };

  createTask = async (body: any) => {
    return await this.taskSrvc.createTask(body);
  };
}
