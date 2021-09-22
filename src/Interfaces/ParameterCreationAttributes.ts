import { Optional } from 'sequelize/types';
import ParameterAttributes from './ParameterAttributes';

type ParameterCreationAttributes = Optional<ParameterAttributes, 'id'>;

export default ParameterCreationAttributes;
