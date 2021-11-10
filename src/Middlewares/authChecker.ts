import { Response, NextFunction } from 'express';
import { validate, checkUser } from '../Services/UserAPI';
import { UserTypes } from '../Enum/UserTypes';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adminChecker = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    const { userId, userType } = await checkUser(token) as {
      userId: number;
      userType: number;
    };
    if (userId && userType && userType === UserTypes.administrator) {
      next();
    } else {
      res.status(401).send({ message: 'auth failed' });
    }
  } catch (error) {
    res.status(401).send({ message: 'auth failed' });
  }
};

export default {
  authChecker,
  adminChecker,
};
