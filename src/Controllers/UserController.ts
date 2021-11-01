// TODO: Get rid of all the 'any' mentions
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Handler, Request, Response, Router,
} from 'express';
import UserAPI, { checkUser as checkUserFromAPI } from '../Services/UserAPI';

const router = Router();

const create: Handler = async (req: Request, res: Response) => {
  try {
    const user: any = await UserAPI.create(req.body);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const listUsers: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const userList: any = await
    UserAPI.listUsers(req.query.type, req.query.limit, req.query.offset, req.query.search, token);
    return res.status(200).send(userList);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const login: Handler = async (req: Request, res: Response) => {
  try {
    const { token, user }: any = await UserAPI.login(req.body);
    return res.status(200).send({ token, user });
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const update: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.update(req.body, req.params.id, token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const password: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.password(req.body, req.params.id, token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const approve: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.approve(req.params.id, token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const cancel: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.cancel(req.params.id, token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const giveAdminPermission: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.giveAdminPermission(req.params.id, token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const removeAdminPermission: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.removeAdminPermission(req.params.id, token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const checkUser: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await checkUserFromAPI(token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

const getUser: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.getUser(Number(req.params.id), token);
    return res.status(200).send(user);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

router.post('/', create);
router.get('/', listUsers);
router.post('/login', login);
router.put('/:id', update);
router.put('/:id/password', password);
router.put('/:id/approve', approve);
router.put('/:id/cancel', cancel);
router.put('/:id/admin', giveAdminPermission);
router.put('/:id/client', removeAdminPermission);
router.post('/check-user', checkUser);
router.get('/:id', getUser);

export default router;
