import {
  Request, Response, Router,
} from 'express';
import AuditDTO from '../DTOs/AuditDTO';
import logger from '../Logger/logger';
import Auditor from '../Services/Auditor';

const router = Router();

const auditGet = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const audits = await Auditor.getAudit(Number(req.query.cant), Number(req.query.page), token);
    return res.status(200).send(audits);
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

router.get('/', auditGet);

export default router;
