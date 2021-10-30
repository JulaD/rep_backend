import {
  Request, Response, Router,
} from 'express';
import Auditor from '../Services/Auditor';
import { logAndRespond } from './Utils';

const router = Router();

const auditGet = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const audits = await Auditor.getAudit(Number(req.query.cant), Number(req.query.page), token);
    return logAndRespond(res, 200, 'send', audits, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    return logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

router.get('/', auditGet);

export default router;
