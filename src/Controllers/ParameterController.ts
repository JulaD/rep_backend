import {
  Handler, Request, Response, Router,
} from 'express';
import ParameterType from '../Enum/ParameterType';

const router = Router();

const getParametersOfType: Handler = async (req: Request, res: Response) => {
  res.send();
};

router.post('/', getParametersOfType);

export default router;
