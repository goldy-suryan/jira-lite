import { Sequelize } from 'sequelize';
import { TASK_ASSIGNED } from '../../config/pubSub.config.js';
import { AttachmentModel } from '../../models/attachment.model.js';
import { formatDate } from '../../utils/helperFunc.js';
import { ActivityModel } from '../activity/activity.model.js';
import type { NotificationController } from '../notification/notification.controller.js';
import { ProjectModel } from '../project/project.model.js';
import { Shared } from '../shared/shared.js';
import { UserModel } from '../user/user.model.js';
import { TaskModel } from './task.model.js';

export class TaskService extends Shared {
  getTaskDetail = async (id: string) => {
    return await TaskModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'reporter',
        },
        {
          model: UserModel,
          as: 'assignee',
        },
        {
          model: ProjectModel,
          as: 'project',
        },
        {
          model: ActivityModel,
          as: 'activities',
        },
        {
          model: AttachmentModel,
          as: 'attachments',
        },
      ],
    });
  };

  createTask = async (
    user,
    body,
    notificationCtrl: NotificationController,
    transaction,
  ) => {
    const result = await TaskModel.findOne({
      attributes: [
        [Sequelize.fn('Max', Sequelize.col('position')), 'maxPosition'],
      ],
      where: {
        projectId: body.projectId,
        status: body.status,
        assigneeId: body.assigneeId,
      },
      transaction,
    });
    const nextPosition = (Number(result?.toJSON()?.maxPosition) || 0) + 10000;

    const createdTask = await TaskModel.create<any>(
      {
        ...body,
        position: nextPosition,
      },
      { transaction },
    );

    await ActivityModel.create(
      {
        taskId: createdTask.id,
        action: `${user.name} created task ${createdTask.title} at ${formatDate(createdTask.createdAt)}`,
      },
      {
        transaction,
      },
    );

    if (body.assigneeId != user.id) {
      const payload = {
        receiverId: body.assigneeId,
        type: TASK_ASSIGNED,
        title: 'Task assigned',
        message: `${user.name} assigned "${createdTask.title}" task to you`,
        subId: body.assigneeId,
        subProp: 'taskAssigned',
        metadata: {
          userId: body.assigneeId,
          projectId: body.projectId,
          createdBy: body.createdBy,
          taskId: createdTask.id,
        },
      };
      await this.createAndPublishNotification(
        notificationCtrl,
        payload,
        transaction,
      );
    }

    return createdTask;
  };

  updateTask = async (
    user,
    id: string,
    body: any,
    notificationCtrl,
    transaction,
  ) => {
    const [result, updatedRows] = await TaskModel.update<any>(
      { ...body },
      { where: { id }, returning: true, transaction },
    );

    await ActivityModel.create(
      {
        taskId: id,
        action: `${user.name} updated task ${updatedRows?.[0].title} at ${formatDate(updatedRows?.[0].updatedAt, true)}`,
      },
      {
        transaction,
      },
    );

    if (body.assigneeId != user.id) {
      const payload = {
        receiverId: body.assigneeId,
        type: TASK_ASSIGNED,
        title: 'Task assigned',
        message: `${user.name} assigned "${updatedRows?.[0]?.title}" task to you`,
        subProp: 'taskAssigned',
        metadata: {
          userId: body.assigneeId,
          projectId: body.projectId,
          createdBy: body.createdBy,
          taskId: updatedRows?.[0]?.id,
        },
      };
      await this.createAndPublishNotification(
        notificationCtrl,
        payload,
        transaction,
      );
    }
    return result > 0;
  };

  updateTaskStatusPosition = async (
    user,
    id: string,
    body: any,
    transaction,
  ) => {
    const [result, updatedRows] = await TaskModel.update<any>(
      { ...body },
      { where: { id }, returning: true, transaction },
    );

    await ActivityModel.create(
      {
        taskId: id,
        action: `${user.name} updated task position and status to ${updatedRows?.[0].status?.replaceAll('_', ' ')} at ${formatDate(updatedRows?.[0].updatedAt, true)}`,
      },
      {
        transaction,
      },
    );
    return result > 0;
  };

  deleteTask = async (taskId: string) => {
    const result = await TaskModel.destroy({
      where: {
        id: taskId,
      },
    });
    return result > 0;
  };

  addAttachment = async (user, { taskId, fileName }, transaction) => {
    const createdAttachment = await AttachmentModel.create<any>(
      {
        taskId,
        fileName,
        fileUrl: `https://jira-lite-s3.s3.ap-south-1.amazonaws.com/${fileName}`,
        uploadedBy: user.id,
      },
      { transaction },
    );

    await ActivityModel.create(
      {
        taskId: taskId,
        action: `${user.name} uploaded a file named ${fileName.split('_')[1]} at ${formatDate(createdAttachment.createdAt, true)}`,
      },
      {
        transaction,
      },
    );
    return true;
  };

  filterTasks = async (where) => {
    const tasks = await TaskModel.findAll({
      where,
      include: [
        {
          model: UserModel,
          as: 'assignee',
        },
      ],
    });
    await this.getTaskCommentAttachmentCount(tasks);
    return tasks.map(task => task.toJSON());
  };
}
