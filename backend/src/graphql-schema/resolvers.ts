import type { ProjectController } from '../controllers/project.controller';
import type { TaskController } from '../controllers/task.contoller';
import { unauthorizedError } from '../utils/helperFunc';
import { projectResolver } from './resolvers/project-resolver';
import { taskResolver } from './resolvers/task-resolver';

export const resolvers = {
  Query: {
    ...projectResolver,
    ...taskResolver,
  },

  Mutation: {
    createProject(
      parent: any,
      args: any,
      { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return projectCtrl.createProject(args, user);
    },
    createTask(
      parent: any,
      args: any,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.createTask(args?.input);
    },
  },
};
