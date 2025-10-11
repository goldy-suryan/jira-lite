import { DataTypes } from 'sequelize';
import { DBConfig } from '../config/sequelize.init';

export const UserProjectJunctionModel = DBConfig.sequelize.define(
  'userProject',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    projectId: {
      type: DataTypes.UUID,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'projectId'],
      },
    ],
  },
);
