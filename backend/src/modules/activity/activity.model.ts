import { DataTypes } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';

export const ActivityModel = DBConfig.sequelize.define(
  'activity',
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
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    tableName: 'activity',
    indexes: [
      {
        fields: ['taskId'],
      },
    ],
  },
);
