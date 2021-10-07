import {
  Handler, Request, Response, Router,
} from 'express';
import ParameterType from '../Enum/ParameterType';
import logger from '../Logger/logger';
import ParameterService from '../Services/ParameterService';

const router = Router();

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

const getParametersOfType: Handler = async (req: Request, res: Response) => {
  // const { paramType } = req.body;
  // try {
  //   const parameters = await ParameterService.getParametersOfType(paramType as ParameterType);
  //   return res.status(200).send(parameters);
  // } catch (error) {
  //   const e = error as Error;
  //   logger.info(e.message);
  //   return res.status(400).json({ error: e.message });
  // }
};

router.post('/', getParameters);
router.post('/type/', getParametersOfType);

export default router;
