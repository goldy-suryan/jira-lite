import { Sequelize } from 'sequelize';
import { TaskModel } from './task.model';

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
    const nextPosition = (Number(result?.toJSON()?.maxPosition) || 0) + 10000;
    return await TaskModel.create({
      ...body,
      position: nextPosition,
    });
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
