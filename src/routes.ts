import { Request, Response, Router } from 'express';
import { UserController } from './Controllers';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('Hey! This is REPP API, you can go to /api-docs to learn more!');
});

router.use('/users', UserController);

export default router;
