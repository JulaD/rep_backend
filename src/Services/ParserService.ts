import AgeGroup from '../DTOs/AgeGroupDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';

// const parseSex = (sexo: string): Sex => {
//   let sex: Sex = sexo;
//   switch (sexo) {
//     case 'Masculino': {
//       sex = Sex.Masculino;
//       break;
//     }
//     case 'Femenino': {
//       sex = Sex.Femenino;
//       break;
//     }
//     default: {
//       throw new Error('Parsing error, attribute sexo does not respect format');
//     }
//   }
//   return sex;
// };
//
// const parseAge = (edad: string): AgeBracket => {
//   let age: AgeBracket;
//   switch (edad) {
//     case '0 meses': {
//       age = AgeBracket.m0;
//       break;
//     }
//     case '1 mes': {
//       age = AgeBracket.m1;
//       break;
//     }
//     case '2 meses': {
//       age = AgeBracket.m2;
//       break;
//     }
//     case '3 meses': {
//       age = AgeBracket.m3;
//       break;
//     }
//     case '4 meses': {
//       age = AgeBracket.m4;
//       break;
//     }
//     case '5 meses': {
//       age = AgeBracket.m5;
//       break;
//     }
//     case '6 meses': {
//       age = AgeBracket.m6;
//       break;
//     }
//     case '7 meses': {
//       age = AgeBracket.m7;
//       break;
//     }
//     case '8 meses': {
//       age = AgeBracket.m8;
//       break;
//     }
//     case '9 meses': {
//       age = AgeBracket.m9;
//       break;
//     }
//     case '10 meses': {
//       age = AgeBracket.m10;
//       break;
//     }
//     case '11 meses': {
//       age = AgeBracket.m11;
//       break;
//     }
//     case '1 año': {
//       age = AgeBracket.a1;
//       break;
//     }
//     case '2 años': {
//       age = AgeBracket.a2;
//       break;
//     }
//     case '3 años': {
//       age = AgeBracket.a3;
//       break;
//     }
//     case '4 años': {
//       age = AgeBracket.a4;
//       break;
//     }
//     case '5 años': {
//       age = AgeBracket.a5;
//       break;
//     }
//     case '6 años': {
//       age = AgeBracket.a6;
//       break;
//     }
//     case '7 años': {
//       age = AgeBracket.a7;
//       break;
//     }
//     case '8 años': {
//       age = AgeBracket.a8;
//       break;
//     }
//     case '9 años': {
//       age = AgeBracket.a9;
//       break;
//     }
//     case '10 años': {
//       age = AgeBracket.a10;
//       break;
//     }
//     case '11 años': {
//       age = AgeBracket.a11;
//       break;
//     }
//     case '12 años': {
//       age = AgeBracket.a12;
//       break;
//     }
//     case '13 años': {
//       age = AgeBracket.a13;
//       break;
//     }
//     case '14 años': {
//       age = AgeBracket.a14;
//       break;
//     }
//     case '15 años': {
//       age = AgeBracket.a15;
//       break;
//     }
//     case '16 años': {
//       age = AgeBracket.a16;
//       break;
//     }
//     case '17 años': {
//       age = AgeBracket.a17;
//       break;
//     }
//     case '18-29 años': {
//       age = AgeBracket.a18_29;
//       break;
//     }
//     case '30-59 años': {
//       age = AgeBracket.a30_59;
//       break;
//     }
//     case '60+ años': {
//       age = AgeBracket.a60;
//       break;
//     }
//     default: {
//       throw new Error('Parsing error, attribute edad does not respect format');
//     }
//   }
//   return age;
// };

const parseGroups = (groups: AgeGroupJSON[]): AgeGroup[] => {
  const retGroups: AgeGroup[] = [];
  groups.forEach((obj: AgeGroupJSON) => {
    // if (typeof (obj.pesoMediano) !== 'number' || typeof (obj.cantidad) !== 'number') {
    //  console.log('Estas haciendo cualquiera flaco');
    //  throw new Error('Parsing error, attributes do not respect format');
    // }
    const group: AgeGroup = {
      edad: obj.edad as AgeBracket,
      sexo: obj.sexo as Sex,
      pesoMediano: parseFloat(obj.pesoMediano),
      cantidad: parseFloat(obj.cantidad),
    };
    retGroups.push(group);
  });
  return retGroups;
};

const unparseGroup = (group: AgeGroup): AgeGroupJSON => {
  const retGroup: AgeGroupJSON = {
    edad: group.edad as string,
    sexo: group.sexo as string,
    pesoMediano: String(group.pesoMediano),
    cantidad: String(group.cantidad),
  };
  return retGroup;
};

export default { parseGroups, unparseGroup };
