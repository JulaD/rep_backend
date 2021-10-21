import express, { Request, Response, NextFunction } from 'express';
import { validate } from '../Services/UserAPI';

const authChecker = (req: any, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;
  const userId = validate(token);
  if (userId === -1) {
    res.status(401).send('auth failed');
  }
  req.user_id = userId;
  next();
};

export default authChecker;
