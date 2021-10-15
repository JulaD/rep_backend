import {
  Handler, Request, Response, Router,
} from 'express';
import { Validator } from 'express-json-validator-middleware';
import CalculatorService from '../Services/CalculatorService';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import logger from '../Logger/logger';
import getRepBody from '../Schemas/getRepBody';

const router = Router();

const { validate } = new Validator({});

const getREP: Handler = async (req: Request, res: Response) => {
  const { groups, extraData } = req.body;
  try {
    // sry pero no sabia como sacarle un caracter a esa linea :(
    // eslint-disable-next-line max-len
    const EnergyReq: CalculatorResponse = await CalculatorService.calculateEnergeticRequirement(groups, extraData);
    return res.status(200).send(EnergyReq);
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

router.post('/', validate({ body: getRepBody }), getREP);

export default router;
