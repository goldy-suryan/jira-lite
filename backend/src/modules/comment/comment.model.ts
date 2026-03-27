import { DataTypes } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';

export const CommentModel = DBConfig.sequelize.define(
  'comment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'task_comments',
    indexes: [
      {
        fields: ['taskId'],
      },
    ],
  },
);
