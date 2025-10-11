export { ProjectModel } from './project.model';
export { UserModel } from './user.model';
export { UserProjectJunctionModel } from './userProject.model';
import { DBConfig } from '../config/sequelize.init';
import { ProjectModel } from './project.model';
import { TaskModel } from './task.model';
import { UserModel } from './user.model';
import { UserProjectJunctionModel } from './userProject.model';

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

await DBConfig.sequelize.sync({ alter: true });
