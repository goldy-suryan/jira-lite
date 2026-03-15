import { DBConfig } from '../../config/sequelize.init.js';
import { TaskService } from './task.service.js';

export class TaskController {
  private readonly taskSrvc = new TaskService();

  getTaskDetail = async (id: string) => {
    return await this.taskSrvc.getTaskDetail(id);
  };

  createTask = async (user, body) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      const task = await this.taskSrvc.createTask(user, body, transaction);
      return task;
    });
  };

  updateTask = async (id: string, body) => {
    return await this.taskSrvc.updateTask(id, body);
  };

  updateTaskStatusPosition = async (id: string, body) => {
    return await this.taskSrvc.updateTaskStatusPosition(id, body);
  };

  removeTask = async (taskId: string) => {
    return await this.taskSrvc.deleteTask(taskId);
  };
}
