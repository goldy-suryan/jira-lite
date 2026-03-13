import { DataTypes } from 'sequelize';
import { DBConfig } from '../../config/sequelize.init.js';

export const UserModel = DBConfig.sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: 'user',
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['Admin', 'Member', 'Viewer'],
      defaultValue: 'Member',
    },
  },
  {
    paranoid: true,
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password', 'deletedAt'] },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password'],
        },
      },
    },
    validate: {
      usernamePassMatch() {
        if (this.email == this.password) {
          throw new Error('Email and password cannot be same');
        }
      },
    },
  },
);
