import type { Transaction } from 'sequelize';
import { ProjectModel, UserModel, UserProjectJunctionModel } from '../models';
import { TaskModel } from '../models/task.model';

export class ProjectService {
  addProject = async (
    body: Record<string, any>,
    transaction: Transaction,
  ): Promise<InstanceType<typeof ProjectModel>> => {
    return await ProjectModel.create(body, { transaction });
  };

  addToUserProjectModel = async (
    userId: string,
    projectId: string,
    transaction: Transaction,
  ) => {
    return await UserProjectJunctionModel.create(
      {
        userId: userId,
        projectId: projectId,
      },
      { transaction },
    );
  };

  getProjects = async () => {
    const projects = await ProjectModel.findAll({
      include: {
        model: UserModel,
        as: 'owner',
      },
    });
    return projects.map((project) => project.toJSON());
  };

  findProjectByName = async (body: { name: string }) => {
    const foundProject = await ProjectModel.findOne({
      where: { name: body.name },
      include: [
        { model: UserModel, as: 'owner' },
        { model: TaskModel, as: 'tasks' },
      ],
    });
    return foundProject;
  };

  findProjectByPK = async (id: string) => {
    const foundProject = await ProjectModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'owner' },
        { model: TaskModel, as: 'tasks' },
      ],
    });
    return foundProject;
  };

  findUserProjects = async (id: string) => {
    const userProjects = await UserModel.findByPk(id, {
      include: [
        { model: ProjectModel, as: 'projects', through: { attributes: [] } },
      ],
    });
    return userProjects;
  };
}
