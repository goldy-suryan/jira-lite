import { Op } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';
import { TaskService } from './task.service.js';

export class TaskController {
  private readonly taskSrvc = new TaskService();

  getTaskDetail = async (id: string) => {
    return await this.taskSrvc.getTaskDetail(id);
  };

  createTask = async (user, body, notificationCtrl) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      const task = await this.taskSrvc.createTask(
        user,
        body,
        notificationCtrl,
        transaction,
      );
      return task;
    });
  };

  updateTask = async (user, id: string, body, notificationCtrl) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      return await this.taskSrvc.updateTask(
        user,
        id,
        body,
        notificationCtrl,
        transaction,
      );
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

  filterTasks = async (user, body) => {
    let where = {};

    where['createdBy'] = user.id;

    if (body?.searchTerm) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${body.searchTerm}%` } },
        { description: { [Op.iLike]: `%${body.searchTerm}%` } },
      ];
    }
    if (body?.member?.length) {
      where['assigneeId'] = { [Op.in]: body.member };
    }
    if (body?.priority?.length) {
      where['priority'] = {
        [Op.in]: body.priority.map((p) => p?.toUpperCase()),
      };
    }
    if (body?.status?.length) {
      where['status'] = {
        [Op.in]: body.status.map((item) =>
          item.toUpperCase().replaceAll(' ', '_'),
        ),
      };
    }
    if (body?.due) {
      where['dueDate'] = { [Op.lte]: body.due };
    }

    return await this.taskSrvc.filterTasks(where);
  };
}
