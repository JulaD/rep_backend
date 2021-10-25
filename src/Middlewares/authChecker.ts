import { Response, NextFunction } from 'express';
import { validate } from '../Services/UserAPI';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authChecker = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    const { userId } = await validate(token) as { userId: number };
    req.user_id = userId;
    next();
  } catch (error) {
    res.status(401).send({ message: 'auth failed' });
  }
};

export default authChecker;
