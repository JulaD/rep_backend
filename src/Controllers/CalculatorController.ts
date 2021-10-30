import {
  Handler, Request, Response, Router,
} from 'express';
import { Validator } from 'express-json-validator-middleware';
import CalculatorService from '../Services/CalculatorService';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import logger from '../Logger/logger';
import getRepBody from '../Schemas/getRepBody';
import { audit } from '../Services/Auditor';
import { logAndRespond } from './Utils';

const router = Router();

const { validate } = new Validator({});

const getREP: Handler = async (req: Request, res: Response) => {
  const { groups, extraData } = req.body;
  try {
    const EnergyReq: CalculatorResponse = await CalculatorService
      .calculateEnergeticRequirement(groups, extraData);
    audit(req, 'Calculó el REP');
    return logAndRespond(res, 200, 'send', EnergyReq, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    return logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

router.post('/', validate({ body: getRepBody }), getREP);

export default router;
