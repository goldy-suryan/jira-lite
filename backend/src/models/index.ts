import { DBConfig } from '../config/sequelize.init.js';
import { ProjectModel } from '../modules/project/project.model.js';
import { InvitationModel } from '../modules/invitation/invitation.model.js';
import { TaskModel } from '../modules/task/task.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { UserProjectJunctionModel } from './userProject.model.js';

// ========== USER PROJECT ASSOCIATION (Membership / user member of projects)=================
UserModel.belongsToMany(ProjectModel, {
  through: UserProjectJunctionModel,
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: 'projects',
});

ProjectModel.belongsToMany(UserModel, {
  through: UserProjectJunctionModel,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'users',
});
// ====================================================================

// =============== OWNER ASSOCIATION (Ownership / user owner of the project`)=======================
UserModel.hasMany(ProjectModel, {
  foreignKey: 'ownerId',
  as: 'ownedProjects',
});

ProjectModel.belongsTo(UserModel, {
  foreignKey: 'ownerId',
  as: 'owner',
  onDelete: 'CASCADE',
});
// ====================================================================

// ================= PROJECT TASK ASSOCIATION =========================
ProjectModel.hasMany(TaskModel, {
  foreignKey: 'projectId',
  onDelete: 'CASCADE',
  as: 'tasks',
});

TaskModel.belongsTo(ProjectModel, {
  foreignKey: 'projectId',
  onDelete: 'CASCADE',
  as: 'project',
});
// =====================================================================

// ===================== USER TASK ASSOCIATION =========================
UserModel.hasMany(TaskModel, {
  foreignKey: 'assigneeId',
  as: 'assignedTask',
});
TaskModel.belongsTo(UserModel, {
  foreignKey: 'assigneeId',
  as: 'assignee',
});

UserModel.hasMany(TaskModel, {
  foreignKey: 'createdBy',
  as: 'createdTasks',
});
TaskModel.belongsTo(UserModel, {
  foreignKey: 'createdBy',
  as: 'reporter',
});
// =====================================================================

// ================= PROJECT INVITATION ASSOCIATION ====================

ProjectModel.hasMany(InvitationModel, {
  foreignKey: 'projectId',
  as: 'invitations',
});

InvitationModel.belongsTo(ProjectModel, {
  foreignKey: 'projectId',
  as: 'project'
});

UserModel.hasMany(InvitationModel, {
  foreignKey: 'invitedBy',
  as: 'sendInvitations',
});

InvitationModel.belongsTo(UserModel, {
  foreignKey: 'invitedBy',
  as: 'invitedByUser'
})

// =====================================================================

await DBConfig.sequelize.sync({ alter: true });
