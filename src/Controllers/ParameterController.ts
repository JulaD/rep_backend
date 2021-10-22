import {
  Handler, Request, Response, Router,
} from 'express';
import { Validator } from 'express-json-validator-middleware';
import ParameterType from '../Enum/ParameterType';
import logger from '../Logger/logger';
import updateParameterValueBody from '../Schemas/updateParameterValueBody';
import ParameterService from '../Services/ParameterService';

const router = Router();

const { validate } = new Validator({});

const getParameters: Handler = async (req: Request, res: Response) => {
  try {
    const parameters = await ParameterService.getParameters();
    return res.status(200).send(parameters);
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

const getDefaultWeights: Handler = async (req: Request, res: Response) => {
  try {
    const weights = await ParameterService.getDefaultWeights();
    return res.status(200).send(weights);
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

const getDefaultExtraData: Handler = async (req: Request, res: Response) => {
  try {
    const extraData = await ParameterService.getDefaultExtraData();
    return res.status(200).send(extraData);
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

const updateParameterValue: Handler = async (req: Request, res: Response) => {
  const { parameters } = req.body;
  try {
    switch (parameters[0].parameterType) {
      case ParameterType.DefaultWeight:
        await ParameterService.updateDefaultWeight(parameters[0]);
        break;
      case ParameterType.MinorPAL:
      case ParameterType.AdultPAL:
      case ParameterType.Maternity:
        await ParameterService.updateExtraData(parameters);
        break;
      case ParameterType.TEE:
        await ParameterService.updateTEE(parameters);
        break;
      case ParameterType.BMR:
        await ParameterService.updateBMR(parameters);
        break;
      case ParameterType.GrowthEnergy:
        await ParameterService.updateGrowthEnergy(parameters[0]);
        break;
      default:
        break;
    }
    return res.status(200).send();
  } catch (error) {
    const e = error as Error;
    logger.info(e.message);
    return res.status(400).json({ error: e.message });
  }
};

router.get('/', getParameters);
router.get('/weights/', getDefaultWeights);
router.get('/extraData/', getDefaultExtraData);
router.put('/parameterUpdate/', validate({ body: updateParameterValueBody }), updateParameterValue);

export default router;
