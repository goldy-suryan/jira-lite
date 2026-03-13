import crypto from 'node:crypto';
import type { Transaction } from 'sequelize';
import { UserProjectJunctionModel } from '../../models/userProject.model.js';
import { sendEmailInvitation } from '../../services/email.service.js';
import { TaskModel } from '../task/task.model.js';
import { UserModel } from '../user/user.model.js';
import { ProjectModel } from './project.model.js';
import { InvitationModel } from '../invitation/invitation.model.js';

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
        {
          model: UserModel,
          as: 'users',
          through: { attributes: [] },
        },
        { model: UserModel, as: 'owner' },
        {
          model: TaskModel,
          as: 'tasks',
          order: [['position', 'asc']],
          separate: true,
        },
      ],
    });
    return foundProject;
  };

  findUserProjects = async (id: string) => {
    const userProjects = await UserModel.findByPk(id, {
      include: [
        {
          model: ProjectModel,
          as: 'projects',
          through: { attributes: [] },
          include: [
            {
              model: UserModel,
              as: 'users',
              through: { attributes: [] },
            },
            {
              model: TaskModel,
              as: 'tasks',
            },
          ],
        },
      ],
    });
    return userProjects;
  };

  getAllUsers = async () => {
    const userList = await UserModel.findAll({});
    return userList;
  };

  sendProjectInvitation = async (user, body) => {
    const token = crypto.randomBytes(32).toString('hex');

    const isInvitationSent = await InvitationModel.create({
      projectId: body.projectId,
      invitedBy: user.id,
      email: body.email,
      token,
    });
    const projectName = await this.findProjectByPK(body.projectId);
    const invitationLink = `${process.env.FRONTEND_URL}/invite?token=${token}`;
    sendEmailInvitation(
      body.email,
      projectName?.toJSON()?.name,
      invitationLink,
    );
    console.log(isInvitationSent, 'isInvitationSent');
    return true;
  };

  getProjectUsers = async (projectId) => {
    const projectUsers = await ProjectModel.findByPk(projectId, {
      include: [
        {
          model: UserModel,
          as: 'users',
          through: { attributes: [] },
        },
      ],
    });
    return projectUsers;
  };
}
