import type { ProjectController } from '../../modules/project/project.controller';
import { unauthorizedError } from '../../utils/helperFunc';

export const projectResolver = {
  getProjects(
    parent: any,
    args: any,
    { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
  ) {
    if (!user) {
      throw unauthorizedError();
    }
    return projectCtrl.getAllProjects();
  },

  getProjectByName(
    parent: any,
    args: any,
    { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
  ) {
    if (!user) {
      throw unauthorizedError();
    }
    return projectCtrl.getProjectByName(args);
  },

  getProjectById(
    parent: any,
    args: any,
    { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
  ) {
    if (!user) {
      throw unauthorizedError();
    }
    return projectCtrl.getProjectById(args);
  },

  getUserProjects(
    parent: any,
    args: any,
    { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
  ) {
    if (!user) {
      throw unauthorizedError();
    }
    return projectCtrl.getUserProjects(user.id);
  },
};
