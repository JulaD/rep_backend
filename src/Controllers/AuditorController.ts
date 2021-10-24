import {
  Request, Response, Router,
} from 'express';

const router = Router();

const auditGet = async (req: Request, res: Response) => {

};

router.get('/', auditGet);

export default router;
