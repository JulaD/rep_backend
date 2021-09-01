/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { Request, Response } from "express";
import { parseExcelService } from "../Services/SheetService";

const parseExcel = async (req:Request, res:Response) => {
  res.status(200).send(parseExcelService());
};

module.exports = {
  parseExcel,
};
