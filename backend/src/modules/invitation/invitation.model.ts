import { DataTypes, Sequelize } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';

export const InvitationModel = DBConfig.sequelize.define(
  'projectInvitation',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    invitedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ['PENDING', 'ACCEPTED', 'DECLINED'],
      defaultValue: 'PENDING',
      set(value: string) {
        this.setDataValue('status', value.toUpperCase());
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("NOW() + INTERVAL '3 days'"),
    },
  },
  {
    paranoid: true,
    tableName: 'project_invitations',
    indexes: [
      {
        fields: ['projectId', 'email', 'token'],
      },
    ],
  },
);
