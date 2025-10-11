import { TaskModel } from '../models/task.model';

export class TaskService {
  getTaskDetail = async (id: string) => {
    return await TaskModel.findByPk(id);
  };

  createTask = async (body: any) => {
    console.log(body, 'body here')
    return await TaskModel.create(body);
  };
}
