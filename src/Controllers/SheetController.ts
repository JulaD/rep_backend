import {
  Handler, Request, Response, Router,
} from 'express';
import { SheetParserResponse } from '../Models/SheetParserResponse';
import SheetService from '../Services/SheetService';

const router = Router();

const parseSheet: Handler = async (req: Request, res: Response) => {
  const sheet: Buffer = req.body;
  try {
    const parsedSheet: SheetParserResponse = SheetService.parseSheetService(sheet);
    return res.status(200).send(parsedSheet);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

/**
 * @swagger
 * /excelParser:
 *  post:
 *      tags:
 *          -   parser
 *      description: Sheet Parser
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
router.post('/', parseSheet);

export default router;
