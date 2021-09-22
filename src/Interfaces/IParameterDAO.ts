import IDAO from './IDAO';
import Parameter from '../Models/Parameter';
import ParameterType from '../Enum/ParameterType';

interface ParameterDAO extends IDAO<Parameter> {
  getParametersOfType(parameterType: ParameterType): Promise<Parameter>;
  getParameter(id: string, type: ParameterType): Promise<Parameter>;
}

export default ParameterDAO;
