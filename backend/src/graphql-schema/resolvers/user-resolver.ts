import type { ProjectController } from '../../modules/project/project.controller.js';
import { unauthorizedError } from '../../utils/helperFunc.js';

export const userResolver = {
  getAllUsers: (
    parent: any,
    args: any,
    { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
  ) => {
    if (!user) {
      return unauthorizedError();
    }
    return projectCtrl.getAllUsers();
  },
};
