import { Request, Response, Router } from 'express';
import SheetController from './Controllers/SheetController';
import CalculatorController from './Controllers/CalculatorController';
import ParameterController from './Controllers/ParameterController';
import FAQController from './Controllers/FAQController';
import UserController from './Controllers/UserController';
import AuditorController from './Controllers/AuditorController';
import AuthMiddleware from './Middlewares/authChecker';

const router = Router();
export const contextPath = '/backend';

// Unknown URL redirection.
router.get('/', (req: Request, res: Response): void => {
  res.redirect(`${contextPath}/api-docs`);
});

router.use('/users', UserController);

// FAQs have authentication on some endpoints
router.use('/faqs', FAQController);
// From this line on a auth verification will be taken

router.use(AuthMiddleware.authChecker);

router.use('/sheetParser', SheetController);

router.use('/repCalculator', CalculatorController);

router.use('/parameters', ParameterController);

router.use('/auditory', AuditorController);

export default router;
