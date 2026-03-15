import { Sequelize } from 'sequelize';
import { ProjectModel } from '../project/project.model.js';
import { UserModel } from '../user/user.model.js';
import { TaskModel } from './task.model.js';
import { ActivityModel } from '../activity/activity.model.js';
import { AttachmentModel } from '../../models/attachment.model.js';

export class TaskService {
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

  createTask = async (user, body, transaction) => {
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

    const foundTask = await TaskModel.create<any>(
      {
        ...body,
        position: nextPosition,
      },
      { transaction },
    );

    await ActivityModel.create(
      {
        taskId: foundTask.id,
        action: `${user.name} created task ${foundTask.title} at ${foundTask.createdAt}`,
      },
      {
        transaction,
      },
    );
    // publish new activity new to the taskId

    return foundTask;
  };

  updateTask = async (user, id: string, body: any, transaction) => {
    const [result, updatedRows] = await TaskModel.update<any>(
      { ...body },
      { where: { id }, returning: true, transaction },
    );

    await ActivityModel.create(
      {
        taskId: id,
        action: `${user.name} updated task ${updatedRows?.[0].title} at ${updatedRows?.[0].updatedAt}`,
      },
      {
        transaction,
      },
    );
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
        action: `${user.name} updated task position and status to ${updatedRows?.[0].status} at ${updatedRows?.[0].updatedAt}`,
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
        action: `${user.name} uploaded a file with ${fileName.split('_')[1]} at ${createdAttachment.createdAt}`,
      },
      {
        transaction,
      },
    );
    return true;
  };
}
