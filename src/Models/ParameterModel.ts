import { Model, DataTypes } from 'sequelize';
import ParameterType from '../Enum/ParameterType';
import ParameterAttributes from '../Interfaces/ParameterAttributes';
import ParameterCreationAttributes from '../Interfaces/ParameterCreationAttributes';
import sequelize from '../Loaders/DataBase';

class Parameter extends Model<ParameterAttributes, ParameterCreationAttributes>
  implements ParameterAttributes {
  id!: string;

  value!: number;

  parameterType!: ParameterType;
}

Parameter.init(
  {
    id: DataTypes.STRING,
    value: DataTypes.NUMBER,
    parameterType: DataTypes.INTEGER,
  },
  { sequelize, modelName: 'Parameter' },
);

export default Parameter;
