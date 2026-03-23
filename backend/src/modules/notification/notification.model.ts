import { DataTypes } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';

export const NotificationModel = DBConfig.sequelize.define(
  'notifications',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['TASK_ASSIGNED', 'COMMENT_ADDED', 'INVITED', 'STATUS_CHANGED'],
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: 'notifications',
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  },
);
