import { DataTypes } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';
import { ActivityModel } from '../activity/activity.model.js';

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
      values: ['TODO', 'IN_PROGRESS', 'DONE', 'IN_REVIEW', 'READY_FOR_REVIEW'],
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
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 10000,
    },
  },
  {
    paranoid: true,
    tableName: 'tasks',
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

TaskModel.addHook('afterBulkDestroy', async (options: any) => {
  const taskId = options.where.id;
  if (!taskId) return;
  await ActivityModel.destroy({
    where: {
      taskId,
    },
    transaction: options.transaction,
  });
});
