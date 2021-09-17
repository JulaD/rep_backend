import * as XLSX from 'xlsx';
import { SheetNames } from '../Config/Constants';
import {
  SheetParserResponse, Menores, Mayores, MenoresSheet, MayoresSheet,
} from '../Models/SheetParserResponse';

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

/* EXPORT FUNCTIONS */

const parseSheetService = (data: Buffer): SheetParserResponse => {
  const workbook: XLSX.WorkBook = XLSX.read(data);
  let parsed: SheetParserResponse = null;
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
  parsed = {
    hombresMenores,
    hombres,
    mujeresMenores,
    mujeres,
  };

  return parsed;
  // TODO: depends on sheet layout what to do
};

export default {
  parseSheetService,
};
