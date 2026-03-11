import type { ProjectController } from '../../modules/project/project.controller';
import { unauthorizedError } from '../../utils/helperFunc';

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
