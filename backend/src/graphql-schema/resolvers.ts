import crypto from 'node:crypto';
import { COMMENT_ADDED, pubSub } from '../config/pubSub.config.js';
import type { CommentController } from '../modules/comment/comment.controller.js';
import type { InvitationController } from '../modules/invitation/invitation.controller.js';
import type { ProjectController } from '../modules/project/project.controller.js';
import type { TaskController } from '../modules/task/task.contoller.js';
import { getSignedS3Url } from '../services/aws-s3.service.js';
import { unauthorizedError } from '../utils/helperFunc.js';
import { commentResolver } from './resolvers/comment-resolver.js';
import { invitationResolver } from './resolvers/invitation-resolver.js';
import { projectResolver } from './resolvers/project-resolver.js';
import { taskResolver } from './resolvers/task-resolver.js';
import { userResolver } from './resolvers/user-resolver.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    ...projectResolver,
    ...taskResolver,
    ...userResolver,
    ...invitationResolver,
    ...commentResolver,
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
      return taskCtrl.createTask(user, args?.input);
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

    updateTaskStatusPosition(
      parent: any,
      args: any,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
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

    sendProjectInvitation(
      parent: any,
      args: any,
      { user, projectCtrl }: { user: any; projectCtrl: ProjectController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return projectCtrl.sendProjectInvitation(user, args);
    },

    invitationResponse: (
      parent,
      args,
      {
        user,
        invitationCtrl,
      }: { user: any; invitationCtrl: InvitationController },
    ) => {
      if (!user) {
        throw unauthorizedError();
      }
      return invitationCtrl.invitationResponse(args, user.id);
    },

    addComment(
      parent: any,
      args: any,
      { user, commentCtrl }: { user: any; commentCtrl: CommentController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return commentCtrl.addComment(user, args);
    },

    async getSignedUrl(parent, args, { user }: { user: any }) {
      if (!user) {
        throw unauthorizedError();
      }
      const MAX_SIZE = 5 * 1024 * 1024;
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/xml',
        'text/xml',
      ];
      if (args.fileSize > MAX_SIZE) {
        throw new GraphQLError('File exceeds 5MB limit');
      }

      if (!allowedTypes.includes(args.fileType)) {
        throw new GraphQLError(
          `Unsupported file type, Supported type ${allowedTypes.join(', ')}`,
        );
      }

      const fileName = `${crypto.randomBytes(32).toString('hex')}_${args.fileName}`;
      return {
        fileName,
        fileUrl: await getSignedS3Url(fileName, args.fileType),
      };
    },

    addAttachmentMetadata(
      parent,
      args,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.addAttachment(user, args);
    },
  },

  Subscription: {
    commentAdded: {
      subscribe: (_, { taskId }) =>
        pubSub.asyncIterator([`${COMMENT_ADDED}_${taskId}`]),
    },
  },
};
