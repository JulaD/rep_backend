import { DataTypes } from 'sequelize';
import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';
import Parameter from './Parameter';
import sequelize from '../Loaders/ParameterDataBase';
import ParameterType from '../Enum/ParameterType';

class EquationConstant extends Parameter {
  ageRange!: AgeBracket;

  sex!: Sex;

  parameterType!: ParameterType;

  order!: number;

  description!: string;
}

EquationConstant.init(
  {
    ageRange: {
      type: DataTypes.STRING(128),
      primaryKey: true,
    },
    sex: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    order: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    description: DataTypes.STRING,
    parameterType: DataTypes.STRING,
    value: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: 'EquationConstant',
    timestamps: false,
  },
);

export default EquationConstant;
