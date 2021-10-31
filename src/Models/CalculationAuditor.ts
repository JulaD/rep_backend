import { DataTypes, Model } from 'sequelize';
import sequelize from '../Loaders/ParameterDataBase';

class CalculationAuditor extends Model {
  id!: number;

  user_id!: number;

  isTemplateUsed!: boolean;

  createdAt!: string;
}

CalculationAuditor.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: DataTypes.INTEGER,
  isTemplateUsed: DataTypes.TINYINT,
},
{
  sequelize,
  modelName: 'CalculationAuditor',
  timestamps: true,
});

// BD: ID // USER ID // IS TEMPLATE USED // CREATED AT
export default CalculationAuditor;
