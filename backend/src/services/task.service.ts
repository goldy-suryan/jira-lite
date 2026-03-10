import { Sequelize } from 'sequelize';
import { TaskModel } from '../models/task.model';

export class TaskService {
  getTaskDetail = async (id: string) => {
    return await TaskModel.findByPk(id);
  };

  createTask = async (body: any) => {
    const result = await TaskModel.findOne({
      attributes: [
        [Sequelize.fn('Max', Sequelize.col('position')), 'maxPosition'],
      ],
      where: {
        projectId: body.projectId,
        status: body.status,
        assigneeId: body.assigneeId,
      },
    });
    const nextPosition = (result?.toJSON()?.maxPosition || 0) + 10000;
    return await TaskModel.create({
      ...body,
      position: nextPosition,
    });
  };

  deleteTask = async (taskId: string) => {
    const result = await TaskModel.destroy({
      where: {
        id: taskId,
      },
    });
    console.log(result, 'result');
    return result > 0;
  };
}
