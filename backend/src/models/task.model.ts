import { DataTypes } from 'sequelize';
import { DBConfig } from '../config/sequelize.init';

export const TaskModel = DBConfig.sequelize.define(
  'task',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['TODO', 'IN_PROGRESS', 'DONE'],
      defaultValue: 'TODO',
      set(value: string) {
        this.setDataValue('status', value.toUpperCase());
      },
    },
    priority: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['LOW', 'MEDIUM', 'HIGH'],
      defaultValue: 'LOW',
      set(value: string) {
        this.setDataValue('priority', value.toUpperCase());
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigneeId: {
      type: DataTypes.UUID,
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ['deletedAt'] },
    },
    indexes: [
      {
        fields: ['projectId'],
      },
    ],
  },
);
