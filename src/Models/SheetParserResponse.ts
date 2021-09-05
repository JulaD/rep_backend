type SheetParserResponse = {
  hombresMenores: Menores[] | null;
  mujeresMenores: Menores[] | null;
  hombres: Mayores[] | null;
  mujeres: Mayores[] | null;
} | null;

type Menores = {
  edad: number;
  peso: number;
} | null;

type Mayores = {
  edad: number;
  peso?: number;
  talla?: number;
} | null;

type MenoresSheet = {
  'Edad (meses)': number;
  'Peso (Kg)': number;
};
type MayoresSheet = {
  'Edad (años)': number;
  'Peso (Kg)': number;
  'Talla (cm)': number;
};

export type {
  SheetParserResponse, Menores, Mayores, MenoresSheet, MayoresSheet,
};
