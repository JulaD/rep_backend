import { Request, Response } from 'express';

const { Router } = require('express');
const { parseExcel } = require('./Controllers/ExcelController.ts');

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('Hey! This is REPP API, you can go to /api-docs to learn more!');
});

// Che esto es para ejemplo de como usar swagger, hay que arreglarlo
// TODO
/**
 * @swagger
 * /excelParser:
 *  post:
 *      tags:
 *          -   parser
 *      description: Excel Parser
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          -   email
 *                          -   password
 *                      properties:
 *                          excel:
 *                              type: string
 *      responses:
 *          '200':
 *              description: returns the parsed JSON of the excel file provided
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              excelParsed:
 *                                  type: string
 */
router.post('/excelParser', parseExcel);

module.exports = router;
