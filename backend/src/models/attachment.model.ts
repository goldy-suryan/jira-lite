import { DataTypes } from 'sequelize';
import { DBConfig } from '../config/sequelize.init.js';

export const AttachmentModel = DBConfig.sequelize.define(
  'attachment',
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
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'attachment',
    indexes: [
      {
        fields: ['taskId', 'uploadedBy'],
      },
    ],
  },
);
