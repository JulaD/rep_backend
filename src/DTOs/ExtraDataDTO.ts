import AdultPAL from './AdultPALDTO';
import IndividualMaternity from './IndividualMaternityDTO';
import MinorPAL from './MinorPALDTO';
import PopulationMaternity from './PopulationMaternityDTO';

type ExtraData = {
  minorPAL: MinorPAL | undefined;
  adultPAL: AdultPAL | undefined;
  maternity: IndividualMaternity | PopulationMaternity | undefined;
};

export default ExtraData;
