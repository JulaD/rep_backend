import {
  Handler, Request, Response, Router,
} from 'express';
import SheetService from '../Services/SheetService';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import { audit } from '../Services/AuditorService';
import { logAndRespond } from './Utils';

const router = Router();

const parseSheet: Handler = async (req: Request, res: Response) => {
  const sheet: Buffer = req.body;
  try {
    const parsedSheet: AgeGroupJSON[] = SheetService.parseSheetService(sheet);
    logAndRespond(res, 200, 'send', parsedSheet, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

router.post('/', parseSheet);

export default router;
