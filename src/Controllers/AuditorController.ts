import {
  Request, Response, Router,
} from 'express';
import Auditor from '../Services/AuditorService';
import { logAndRespond } from './Utils';

const router = Router();

const auditGet = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const { filters } = req.query;
    const audits = await
    Auditor.getAudit(Number(req.query.cant), Number(req.query.page), token, filters as string[]);
    return logAndRespond(res, 200, 'send', audits, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    return logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

const calculationAuditGet = async (req: Request, res: Response) => {
  try {
    const audits = await
    Auditor.getCalculationsAudit(req.body.userIds, req.body.dateFrom, req.body.dateTo);
    return logAndRespond(res, 200, 'send', audits, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    return logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

router.get('/', auditGet);
router.post('/calculations', calculationAuditGet);

export default router;
