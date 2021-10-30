import {
  Handler, Request, Response, Router,
} from 'express';
import { Validator } from 'express-json-validator-middleware';
import ParameterType from '../Enum/ParameterType';
import logger from '../Logger/logger';
import updateParameterValueBody from '../Schemas/updateParameterValueBody';
import { audit } from '../Services/Auditor';
import ParameterService from '../Services/ParameterService';
import { logAndRespond } from './Utils';

const router = Router();

const { validate } = new Validator({});

const getParameters: Handler = async (req: Request, res: Response) => {
  try {
    const parameters = await ParameterService.getParameters();
    logAndRespond(res, 200, 'send', parameters, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

const getDefaultWeights: Handler = async (req: Request, res: Response) => {
  try {
    const weights = await ParameterService.getDefaultWeights();
    logAndRespond(res, 200, 'send', weights, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

const getDefaultExtraData: Handler = async (req: Request, res: Response) => {
  try {
    const extraData = await ParameterService.getDefaultExtraData();
    logAndRespond(res, 200, 'send', extraData, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
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
    audit(req, `Cambió el parametro ${parameters[0].parameterType} a ${parameters[0].value} para ${parameters[0].sex} ${parameters[0].ageRang} `);
    logAndRespond(res, 200, 'json', { message: 'Parameter changed' }, 'info', null, null);
  } catch (error) {
    const e = error as Error;
    logAndRespond(res, 400, 'json', { error: e.message }, 'info', null, null);
  }
};

router.get('/', getParameters);
router.get('/weights/', getDefaultWeights);
router.get('/extraData/', getDefaultExtraData);
router.put('/parameterUpdate/', validate({ body: updateParameterValueBody }), updateParameterValue);

export default router;
