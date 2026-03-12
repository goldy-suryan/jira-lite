import { DataTypes } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';

export const ProjectModel = DBConfig.sequelize.define(
  'project',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value: string) {
        this.setDataValue('key', value.toUpperCase());
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    paranoid: true,
    tableName: 'projects',
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
    indexes: [
      {
        fields: ['ownerId', 'name'],
      },
    ],
  },
);
