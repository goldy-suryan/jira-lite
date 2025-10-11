import { DBConfig } from '../config/sequelize.init';
import { ProjectService } from '../services/project.service';

export class ProjectController {
  private readonly projectSrvc = new ProjectService();

  createProject = async (body: any, user: any) => {
    const transaction = await DBConfig.sequelize.transaction();
    try {
      const savedproject = await this.projectSrvc.addProject(
        {
          ...body,
          ownerId: user!.id,
        },
        transaction,
      );
      await this.projectSrvc.addToUserProjectModel(
        user!.id,
        savedproject.toJSON().id,
        transaction,
      );
      await transaction.commit();
      return savedproject;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  };

  getAllProjects = async () => {
    const allProjects = await this.projectSrvc.getProjects();
    return allProjects;
  };

  getProjectByName = async (body: { name: string }) => {
    const project = await this.projectSrvc.findProjectByName(body);
    return project;
  };

  getProjectById = async (body: { id: string }) => {
    const project = await this.projectSrvc.findProjectByPK(body.id);
    return project;
  };
}
