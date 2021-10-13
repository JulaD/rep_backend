import * as XLSX from 'xlsx';
import { SheetNames } from '../Config/Constants';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import Sex from '../Enum/Sex';
import {
  SheetParserResponse, Menores, Mayores, MenoresSheet, MayoresSheet,
} from '../Models/SheetParserResponse';
import ParameterService from './ParameterService';

/* PRIVATE FUNCTIONS */
// const ec = (r: number, c: number): string => XLSX.utils.encode_cell({ r, c });
// const deleteRow = (ws: XLSX.WorkSheet, rowIndex: number): XLSX.WorkSheet => {
//   const work = ws;
//   if (work['!ref'] === undefined) throw new Error('An error has ocurred in deleteRow');
//   const variable = XLSX.utils.decode_range(work['!ref']);
//   for (let R = rowIndex; R < variable.e.r; R += 1) {
//     for (let C = variable.s.c; C <= variable.e.c; C += 1) {
//       work[ec(R, C)] = work[ec(R + 1, C)];
//     }
//   }
//   variable.e.r -= 1;
//   work['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
//   return work;
// };

const parseAdults = (worksheet: XLSX.WorkSheet): Mayores[] => {
  const res: Mayores[] = [];
  const ref = worksheet['!ref'];
  if (ref === undefined) throw new Error('An error ocurred');
  const range = XLSX.utils.decode_range(ref);
  range.s.c = 0;
  range.e.c = 2;
  const newRange = XLSX.utils.encode_range(range);

  const aux = XLSX.utils.sheet_to_json(worksheet, { range: newRange }) as unknown as MayoresSheet[];

  aux.forEach((element: MayoresSheet) => {
    res.push(
      {
        edad: element['Edad (años)'],
        peso: element['Peso (Kg)'],
        talla: element['Talla (cm)'],
      },
    );
  });
  return res;
};

const parseBabies = (worksheet: XLSX.WorkSheet): Menores[] => {
  const res: Menores[] = [];
  const aux = XLSX.utils.sheet_to_json(worksheet) as unknown as MenoresSheet[];
  aux.forEach((element: MenoresSheet) => {
    res.push(
      {
        edad: element['Edad (meses)'],
        peso: element['Peso (Kg)'],
      },
    );
  });
  return res;
};
const getMedianFromArray = (arr: number[]): number => {
  const arrSort = arr.sort((a, b) => a - b);
  const len = arr.length;
  const mid = Math.ceil(len / 2);
  const median = len % 2 === 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid - 1];
  return median;
};

const getLiteralGroup = (age: number): string => {
  if (age >= 18 && age <= 29) {
    return '18-29';
  } if (age >= 30 && age <= 59) {
    return '30-59';
  } if (age >= 60) {
    return '60+';
  }
  return `${age}`;
};

/* EXPORT FUNCTIONS */

const parseSheetService = (data: Buffer): AgeGroupJSON[] => {
  const workbook: XLSX.WorkBook = XLSX.read(data);
  const parsed: SheetParserResponse = null;
  let hombresMenores: Menores[] = [];
  let hombres: Mayores[] = [];
  let mujeresMenores: Menores[] = [];
  let mujeres: Mayores[] = [];

  const sheetNames: string[] = workbook.SheetNames;
  // Check there are 4 sheets, no more, no less
  if (sheetNames.length !== 4) {
    throw new Error('File does not respect scheme, there are more or less than 4 sheets');
  }
  sheetNames.forEach((name) => {
    const worksheet: XLSX.WorkSheet = workbook.Sheets[name];
    switch (name) {
      case SheetNames.HOMBRES_MENORES:
        hombresMenores = parseBabies(worksheet);
        break;
      case SheetNames.HOMBRES:
        hombres = parseAdults(worksheet);
        break;
      case SheetNames.MUJERES_MENORES:
        mujeresMenores = parseBabies(worksheet);
        break;
      case SheetNames.MUJERES:
        mujeres = parseAdults(worksheet);
        break;

      default:
        throw new Error(`Sheet name ${name} is not part of the scheme `);
    }
  });

  const res: AgeGroupJSON[] = [];

  let auxObj: {[key: string]: number[]} = {};
  // group HombresMenores
  // Iterate on hombresMenores and put
  // elemnts on auxObj
  hombresMenores.forEach((item) => {
    if (item === null) throw new Error('Item is null');
    const bridge: string = (item.edad).toString();
    auxObj[bridge] = auxObj[bridge] ? auxObj[bridge] : [];
    (auxObj[bridge]).push(item.peso);
  });
  // creates AgeGroup and insert into res
  let auxObjKeys = Object.keys(auxObj);
  auxObjKeys.forEach((key) => {
    const toInsert: AgeGroupJSON = {
      age: `${key} meses`,
      sex: Sex.Male,
      medianWeight: getMedianFromArray(auxObj[key]),
      population: auxObj[key].length,
    };
    res.push(toInsert);
  });

  auxObj = {};

  mujeresMenores.forEach((item) => {
    if (item === null) throw new Error('Item is null');
    const bridge: string = (item.edad).toString();
    auxObj[bridge] = auxObj[bridge] ? auxObj[bridge] : [];
    (auxObj[bridge]).push(item.peso);
  });

  // creates AgeGroup for mujeresMenores and insert into res
  auxObjKeys = Object.keys(auxObj);
  auxObjKeys.forEach((key) => {
    const toInsert: AgeGroupJSON = {
      age: `${key} meses`,
      sex: Sex.Female,
      medianWeight: getMedianFromArray(auxObj[key]),
      population: auxObj[key].length,
    };
    res.push(toInsert);
  });

  auxObj = {};
  hombres.forEach((item) => {
    if (item === null) throw new Error('Item is null');
    const bridge: string = getLiteralGroup(item.edad);
    auxObj[bridge] = auxObj[bridge] ? auxObj[bridge] : [];
    let peso;
    if (!item.peso) {
      if (!item.talla) { throw new Error('Talla and Peso not defined'); }
      // ParameterService. TODO:
      peso = 0;
    } else {
      peso = item.peso;
    }
    (auxObj[bridge]).push(peso);
  });

  // creates AgeGroup for hombres and insert into res
  auxObjKeys = Object.keys(auxObj);
  auxObjKeys.forEach((key) => {
    const toInsert: AgeGroupJSON = {
      age: `${key} años`,
      sex: Sex.Male,
      medianWeight: getMedianFromArray(auxObj[key]),
      population: auxObj[key].length,
    };
    res.push(toInsert);
  });

  auxObj = {};
  mujeres.forEach((item) => {
    if (item === null) throw new Error('Item is null');
    const bridge: string = getLiteralGroup(item.edad);
    auxObj[bridge] = auxObj[bridge] ? auxObj[bridge] : [];
    let peso;
    if (!item.peso) {
      if (!item.talla) { throw new Error('Talla and Peso not defined'); }
      // ParameterService. TODO:
      peso = 0;
    } else {
      peso = item.peso;
    }
    (auxObj[bridge]).push(peso);
  });

  // creates AgeGroup for hombres and insert into res
  auxObjKeys = Object.keys(auxObj);
  auxObjKeys.forEach((key) => {
    const toInsert: AgeGroupJSON = {
      age: `${key} años`,
      sex: Sex.Female,
      medianWeight: getMedianFromArray(auxObj[key]),
      population: auxObj[key].length,
    };
    res.push(toInsert);
  });

  return res;
  // TODO: depends on sheet layout what to do
};

export default {
  parseSheetService,
};
