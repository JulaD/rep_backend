import AdultPAL from './AdultPALDTO';
import IndividualMaternity from './IndividualMaternityDTO';
import MinorPAL from './MinorPALDTO';
import PopulationMaternity from './PopulationMaternityDTO';

type ExtraData = {
  minorPAL: MinorPAL | undefined;
  adultPAL: AdultPAL | undefined;
  maternity18To29: IndividualMaternity | PopulationMaternity | undefined;
  maternity30To59: IndividualMaternity | undefined;
};

export default ExtraData;
