import { DataTypes, Model } from 'sequelize';
import sequelize from '../Loaders/ParameterDataBase';

class Auditor extends Model {
  id!: number;

  user_id!: number;

  action!: string;

  createdAt!: string;
}

Auditor.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
},
{
  sequelize,
  modelName: 'Auditor',
  timestamps: true,
});

// BD: ID // USER ID // ACTION // TIME
export default Auditor;
