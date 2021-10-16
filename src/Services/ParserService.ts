import AgeGroup from '../DTOs/AgeGroupDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';

const checkAgeGroup = (group: AgeGroupJSON): boolean => (
  typeof (group.age) !== 'string'
  || typeof (group.sex) !== 'string'
  || typeof (group.medianWeight) !== 'number'
  || typeof (group.population) !== 'number'
  || group.medianWeight <= 0
  || group.population <= 0
);

const parseGroups = (groups: AgeGroupJSON[]): AgeGroup[] => {
  const retGroups: AgeGroup[] = [];
  groups.forEach((ageGroup: AgeGroupJSON) => {
    if (checkAgeGroup(ageGroup)) {
      throw new Error('Age group data does not meet specification');
    } else {
      const group: AgeGroup = {
        age: ageGroup.age as AgeBracket,
        sex: ageGroup.sex as Sex,
        medianWeight: ageGroup.medianWeight,
        population: ageGroup.population,
      };
      retGroups.push(group);
    }
  });
  return retGroups;
};

const unparseGroup = (group: AgeGroup): AgeGroupJSON => {
  const retGroup: AgeGroupJSON = {
    age: group.age as string,
    sex: group.sex as string,
    medianWeight: group.medianWeight,
    population: group.population,
  };
  return retGroup;
};

export default { parseGroups, unparseGroup };
