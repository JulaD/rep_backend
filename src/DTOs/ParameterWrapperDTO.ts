import DefaultExtraDataDTO from './DefaultExtraDataDTO';
import DefaultWeightDTO from './DefaultWeightDTO';
import EquationConstantDTO from './EquationConstantDTO';

type ParameterWrapperDTO = {
  defaultExtraData: DefaultExtraDataDTO[];
  defaultWeights: DefaultWeightDTO[];
  equationConstants: EquationConstantDTO[];
};

export default ParameterWrapperDTO;
