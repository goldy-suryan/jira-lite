import { TaskService } from './task.service';

export class TaskController {
  private readonly taskSrvc = new TaskService();

  getTaskDetail = async (id: string) => {
    return await this.taskSrvc.getTaskDetail(id);
  };

  createTask = async (body: any) => {
    return await this.taskSrvc.createTask(body);
  };

  updateTask = async (id: string, body: any) => {
    return await this.taskSrvc.updateTask(id, body);
  };

  updateTaskStatusPosition = async (id: string, body: any) => {
    return await this.taskSrvc.updateTaskStatusPosition(id, body);
  };

  removeTask = async (taskId: string) => {
    return await this.taskSrvc.deleteTask(taskId);
  };
}
