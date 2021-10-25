import { DataTypes } from 'sequelize';
import Parameter from './Parameter';
import sequelize from '../Loaders/ParameterDataBase';
import ParameterType from '../Enum/ParameterType';

class DefaultExtraData extends Parameter {
  id!: string;

  parameterType!: ParameterType;

  order!: number;

  description!: string;
}

DefaultExtraData.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    parameterType: DataTypes.STRING,
    value: DataTypes.FLOAT(25),
    order: DataTypes.INTEGER,
    description: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'DefaultExtraData',
    timestamps: false,
  },
);

export default DefaultExtraData;
