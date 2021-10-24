import { Request, Response, Router } from 'express';
import SheetController from './Controllers/SheetController';
import CalculatorController from './Controllers/CalculatorController';
import ParameterController from './Controllers/ParameterController';
import UserController from './Controllers/UserController';
import AuditorController from './Controllers/AuditorController';
import authChecker from './Middlewares/authChecker';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('Hey! This is REPP API, you can go to /api-docs to learn more!');
});

router.use('/users', UserController);
// From this line on a auth verification will be taken
// router.use(authChecker);

router.use('/sheetParser', SheetController);

router.use('/repCalculator', CalculatorController);

router.use('/parameters', ParameterController);

router.use('/audit', AuditorController);

export default router;
