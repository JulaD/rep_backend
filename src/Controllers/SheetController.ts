import {
  Handler, Request, Response, Router,
} from 'express';
import { SheetParserResponse } from '../Models/SheetParserResponse';
import SheetService from '../Services/SheetService';
import logger from '../Logger/logger';

const router = Router();

const parseSheet: Handler = async (req: Request, res: Response) => {
  const sheet: Buffer = req.body;
  try {
    const parsedSheet: SheetParserResponse = SheetService.parseSheetService(sheet);
    return res.status(200).send(parsedSheet);
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

router.post('/', parseSheet);

export default router;
