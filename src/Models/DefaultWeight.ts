import { DataTypes } from 'sequelize';
import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';
import Parameter from './Parameter';
import sequelize from '../Loaders/ParameterDataBase';

class DefaultWeight extends Parameter {
  ageRange!: AgeBracket;

  sex!: Sex;
}

DefaultWeight.init(
  {
    ageRange: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    sex: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: 'DefaultWeight',
    timestamps: false,
  },
);

export default DefaultWeight;
