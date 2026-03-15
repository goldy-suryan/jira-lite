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

  updateTask = async (user, id: string, body) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      return await this.taskSrvc.updateTask(user, id, body, transaction);
    });
  };

  updateTaskStatusPosition = async (user, id: string, body) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      return await this.taskSrvc.updateTaskStatusPosition(
        user,
        id,
        body,
        transaction,
      );
    });
  };

  removeTask = async (taskId: string) => {
    return await this.taskSrvc.deleteTask(taskId);
  };

  addAttachment = async (user, body) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      return await this.taskSrvc.addAttachment(user, body, transaction);
    });
  };
}
