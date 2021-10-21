import { Response, NextFunction } from 'express';
import { validate } from '../Services/UserAPI';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authChecker = (req: any, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;
  const userId = validate(token);
  if (userId === -1) {
    res.status(401).send({ message: 'auth failed' });
    return;
  }
  req.user_id = userId;
  next();
};

export default authChecker;
