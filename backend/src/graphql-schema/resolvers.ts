import { GraphQLError } from 'graphql';
import crypto from 'node:crypto';
import {
  COMMENT_ADDED,
  pubSub,
  TASK_ASSIGNED,
} from '../config/pubSub.config.js';
import type { CommentController } from '../modules/comment/comment.controller.js';
import type { InvitationController } from '../modules/invitation/invitation.controller.js';
import type { NotificationController } from '../modules/notification/notification.controller.js';
import type { ProjectController } from '../modules/project/project.controller.js';
import type { TaskController } from '../modules/task/task.contoller.js';
import { UserModel } from '../modules/user/user.model.js';
import { getSignedS3Url } from '../services/aws-s3.service.js';
import { unauthorizedError } from '../utils/helperFunc.js';
import { commentResolver } from './resolvers/comment-resolver.js';
import { invitationResolver } from './resolvers/invitation-resolver.js';
import { notificationResolver } from './resolvers/notificaiton-resolver.js';
import { projectResolver } from './resolvers/project-resolver.js';
import { taskResolver } from './resolvers/task-resolver.js';
import { userResolver } from './resolvers/user-resolver.js';

export const resolvers = {
  Query: {
    ...projectResolver,
    ...taskResolver,
    ...userResolver,
    ...invitationResolver,
    ...commentResolver,
    ...notificationResolver,
  },


  Notification: {
    user: (notification) => {
      return UserModel.findByPk(notification.receiverId);
    },
  },

  // ===================== MUTATIONS ==========================
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
      {
        user,
        taskCtrl,
        notificationCtrl,
      }: {
        user: any;
        taskCtrl: TaskController;
        notificationCtrl: NotificationController;
      },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.createTask(user, args?.input, notificationCtrl);
    },

    updateTask(
      parent: any,
      args: any,
      {
        user,
        taskCtrl,
        notificationCtrl,
      }: {
        user: any;
        taskCtrl: TaskController;
        notificationCtrl: NotificationController;
      },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.updateTask(user, args?.id, args?.input, notificationCtrl);
    },

    updateTaskStatusPosition(
      parent: any,
      args: any,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.updateTaskStatusPosition(user, args?.id, args?.input);
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
      {
        user,
        commentCtrl,
        notificationCtrl,
      }: {
        user: any;
        commentCtrl: CommentController;
        notificationCtrl: NotificationController;
      },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return commentCtrl.addComment(user, args, notificationCtrl);
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

    markAsRead(
      parent,
      args,
      {
        user,
        notificationCtrl,
      }: { user: any; notificationCtrl: NotificationController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return notificationCtrl.markAsRead(args.notiId);
    },

    filterTasks(
      parent,
      args,
      { user, taskCtrl }: { user: any; taskCtrl: TaskController },
    ) {
      if (!user) {
        throw unauthorizedError();
      }
      return taskCtrl.filterTasks(user, args.input);
    },
  },

  // ================= SUBSCRIPTIONS =======================
  Subscription: {
    commentAdded: {
      subscribe: (_, { taskId }) =>
        pubSub.asyncIterator([`${COMMENT_ADDED}_${taskId}`]),
    },
    taskAssigned: {
      subscribe: (_, { userId }) => {
        return pubSub.asyncIterator([`${TASK_ASSIGNED}_${userId}`]);
      },
    },
    commentNotification: {
      subscribe: (_, { userId }) => {
        return pubSub.asyncIterator(`${COMMENT_ADDED}_${userId}`);
      },
    },
  },
};
