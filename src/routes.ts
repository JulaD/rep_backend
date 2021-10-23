import { Request, Response, Router } from 'express';
import SheetController from './Controllers/SheetController';
import CalculatorController from './Controllers/CalculatorController';
import ParameterController from './Controllers/ParameterController';
import FAQController from './Controllers/FAQController';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('Hey! This is REPP API, you can go to /api-docs to learn more!');
});

router.use('/sheetParser', SheetController);

router.use('/repCalculator', CalculatorController);

router.use('/parameters', ParameterController);

router.use('/faqs', FAQController);

export default router;
