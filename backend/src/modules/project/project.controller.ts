import { DBConfig } from '../../config/sequelize.init.js';
import { ProjectService } from './project.service.js';

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

  getUserProjects = async (userId: string) => {
    const userProjects = await this.projectSrvc.findUserProjects(userId);
    return userProjects;
  };

  getAllUsers = async () => {
    const userList = await this.projectSrvc.getAllUsers();
    return userList;
  };

  sendProjectInvitation = async (user, body) => {
    const sendInvitation = await this.projectSrvc.sendProjectInvitation(user, body);
    return sendInvitation;
  };

  getProjectUsers = async (projectId) => {
    return await this.projectSrvc.getProjectUsers(projectId);
  }
}
