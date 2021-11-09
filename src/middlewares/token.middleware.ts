import { Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import { secret } from '../config/config';

const authorized = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const token: string = req.headers.authorization || '';
  if (token) {
    jwt.verify(token, secret.auth, (error: Error, decoded: {user: number; role: number}) => {
      if (error) {
        res.status(401).send('auth failed');
      } else {
        req.auth = {
          userId: decoded.user,
          userType: decoded.role,
        };
        next();
      }
    });
  } else {
    res.status(400).send('auth token not supplied');
  }
};

export {
  authorized,
};
