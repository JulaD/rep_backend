import { Sequelize, DataTypes, Model } from 'sequelize';
import { status } from '../enums/index.enum';
import { UserDTO } from '../DTOs/UserDTO';
import * as environments from '../config/config';

const current: string = process.env.NODE_ENV || 'development';
const config = (environments as any)[current];
const sequelize: Sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

export class User extends Model {
  toJSON(): UserDTO {
    const values = { ...this.get() };

    delete values.password;
    delete values.updatedAt;
    delete values.createdBy;
    delete values.updatedBy;
    delete values.deletedAt;
    return values;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      notEmpty: true,
      len: [3, 40],
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      max: 60,
    },
  },
  organization: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      max: 50,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: {
        args: [[
          String(status.pending),
          String(status.approved),
          String(status.rejected),
        ]],
        msg: 'invalid status',
      },
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'User',
});
