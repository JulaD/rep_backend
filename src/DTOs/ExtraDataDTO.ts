import AdultPAL from './AdultPALDTO';
import IndividualMaternity from './IndividualMaternityDTO';
import MinorPAL from './MinorPALDTO';
import PopulationMaternity from './PopulationMaternityDTO';

type ExtraData = {
  prevalenciaAFMenores: MinorPAL | undefined;
  prevalenciaAFAdultos: AdultPAL | undefined;
  datosEmbarazoLactancia: IndividualMaternity | PopulationMaternity | undefined;
};

export default ExtraData;
