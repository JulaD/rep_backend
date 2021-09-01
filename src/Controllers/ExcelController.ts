/* eslint-disable no-console */
import { Request, Response } from "express";

const parseExcel = async (req:Request, res:Response) => {
  console.log(req);
  console.log(res);
};

module.exports = {
  parseExcel,
};
