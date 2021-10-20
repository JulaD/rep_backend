import AgeGroup from '../DTOs/AgeGroupDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';

const parseGroups = (groups: AgeGroupJSON[]): AgeGroup[] => {
  const retGroups: AgeGroup[] = [];
  groups.forEach((ageGroup: AgeGroupJSON) => {
    const group: AgeGroup = {
      age: ageGroup.age as AgeBracket,
      sex: ageGroup.sex as Sex,
      medianWeight: ageGroup.medianWeight,
      population: ageGroup.population,
    };
    retGroups.push(group);
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
