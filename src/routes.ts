import { Request, Response, Router } from 'express';
import SheetController from './Controllers/SheetController';
import CalculatorController from './Controllers/CalculatorController';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('Hey! This is REPP API, you can go to /api-docs to learn more!');
});

router.use('/sheetParser', SheetController);

router.use('/REPcalculator', CalculatorController);

export default router;
