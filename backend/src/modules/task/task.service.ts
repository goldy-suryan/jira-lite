import { Sequelize } from 'sequelize';
import { ProjectModel } from '../project/project.model.js';
import { UserModel } from '../user/user.model.js';
import { TaskModel } from './task.model.js';
import { ActivityModel } from '../activity/activity.model.js';

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
          as: 'activities'
        }
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

    console.log(user, 'user')
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

  updateTask = async (id: string, body: any) => {
    const [result] = await TaskModel.update({ ...body }, { where: { id } });
    return result > 0;
  };

  updateTaskStatusPosition = async (id: string, body: any) => {
    const [result] = await TaskModel.update({ ...body }, { where: { id } });
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
}
