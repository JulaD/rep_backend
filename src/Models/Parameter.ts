import { Model, DataTypes } from 'sequelize';
import ParameterType from '../Enum/ParameterType';
import sequelize from '../Loaders/ParameterDataBase';

class Parameter extends Model {
  id!: string;

  value!: number;

  parameterType!: ParameterType;
}

Parameter.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: DataTypes.FLOAT,
    parameterType: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'Parameter',
    timestamps: false,
  },
);

export default Parameter;
