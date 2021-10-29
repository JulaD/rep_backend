import { DataTypes, Model, NOW } from 'sequelize';
import sequelize from '../Loaders/ParameterDataBase';

class FAQ extends Model {}

FAQ.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
  },
  answer: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'FAQ',
});

export default FAQ;
