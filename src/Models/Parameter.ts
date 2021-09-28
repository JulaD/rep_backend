import { Model, DataTypes } from 'sequelize';
import ParameterType from '../Enum/ParameterType';
import ParameterAttributes from '../Interfaces/ParameterAttributes';
import ParameterCreationAttributes from '../Interfaces/ParameterCreationAttributes';
import sequelize from '../Loaders/ParameterDataBase';

class Parameter extends Model<ParameterAttributes, ParameterCreationAttributes>
  implements ParameterAttributes {
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
    value: DataTypes.NUMBER,
    parameterType: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  { sequelize, modelName: 'Parameter' },
);

export default Parameter;
