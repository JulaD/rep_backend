import * as XLSX from 'xlsx';
import { SheetNames } from '../Config/Constants';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import Sex from '../Enum/Sex';
import {
  Menores, Mayores, MenoresSheet, MayoresSheet,
} from '../Models/SheetParserResponse';

const parseAdults = (worksheet: XLSX.WorkSheet): Mayores[] => {
  const res: Mayores[] = [];
  const ref = worksheet['!ref'];
  if (ref === undefined) throw new Error('An error ocurred');
  const range = XLSX.utils.decode_range(ref);
  range.s.c = 0;
  range.e.c = 2;
  const newRange = XLSX.utils.encode_range(range);

  const aux = XLSX.utils.sheet_to_json(worksheet, { range: newRange, blankrows: false, defval: '' }) as unknown as MayoresSheet[];

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
  const ref = worksheet['!ref'];
  if (ref === undefined) throw new Error('An error ocurred');
  const range = XLSX.utils.decode_range(ref);
  range.s.c = 0;
  range.e.c = 1;
  const newRange = XLSX.utils.encode_range(range);
  const aux = XLSX.utils.sheet_to_json(worksheet, {
    range: newRange, blankrows: false,
  }) as unknown as MenoresSheet[];

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

const validator = (instance: any) => {
  if (typeof instance.edad !== 'number') {
    throw new Error('Edad should be a number');
  } else if (instance.peso !== '') {
    if (typeof instance.peso !== 'number') {
      throw new Error('Peso should be a number');
    }
  } else if (instance.talla !== '') {
    if (typeof instance.talla !== 'number') {
      throw new Error('Talla should be a number');
    }
  } else {
    throw new Error('A row must have either Peso or Talla');
  }
};

/* EXPORT FUNCTIONS */

const parseSheetService = (data: Buffer): AgeGroupJSON[] => {
  const workbook: XLSX.WorkBook = XLSX.read(data);
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
    validator(item);
    if (item.edad > 12) {
      throw new Error('Edad should be less than 12 months');
    }
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
    validator(item);
    if (item.edad > 12) {
      throw new Error('Edad should be less than 12 months');
    }
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
    validator(item);

    const bridge: string = getLiteralGroup(item.edad);
    auxObj[bridge] = auxObj[bridge] ? auxObj[bridge] : [];
    let peso;
    if (!item.peso) {
      if (!item.talla) { throw new Error('Talla and Peso not defined'); }
      peso = 22 * (item.talla / 100) ** 2;
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
    validator(item);

    const bridge: string = getLiteralGroup(item.edad);
    auxObj[bridge] = auxObj[bridge] ? auxObj[bridge] : [];
    let peso;
    if (!item.peso) {
      if (!item.talla) { throw new Error('Talla and Peso not defined'); }
      peso = 22 * (item.talla / 100) ** 2;
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
