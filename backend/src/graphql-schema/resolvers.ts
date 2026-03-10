import type { ProjectController } from '../controllers/project.controller';
import type { TaskController } from '../controllers/task.contoller';
import { unauthorizedError } from '../utils/helperFunc';
import { projectResolver } from './resolvers/project-resolver';
import { taskResolver } from './resolvers/task-resolver';
import { userResolver } from './resolvers/user-resolver';

export const resolvers = {
  Query: {
    ...projectResolver,
    ...taskResolver,
    ...userResolver,
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
      return projectCtrl.createProject(args?.input, user);
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

    updateTask(
      parent: any,
      args: any,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.updateTask(args?.id, args?.input);
    },

    updateTaskStatusPosition(parent: any, args: any, { user, taskCtrl }: { user: any; taskCtrl: TaskController}) {
      if(!user) {
        throw unauthorizedError();
      }
      return taskCtrl.updateTaskStatusPosition(args?.id, args?.input);
    },

    deleteTask(
      parent: any,
      args: any,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.removeTask(args.taskId);
    },
  },
};
