// TODO: Get rid of all the 'any' mentions
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from 'axios';
import {
  Handler, Request, Response, Router,
} from 'express';
import UserAPI, { checkUser as checkUserFromAPI } from '../Services/UserAPI';
import { logAndRespond } from './Utils';

const router = Router();

const create: Handler = async (req: Request, res: Response) => {
  try {
    const user: any = await UserAPI.create(req.body);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const listUsers: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const userList: any = await
    UserAPI.listUsers(req.query.type, req.query.limit, req.query.offset, req.query.search, token);
    return logAndRespond(res, 200, 'send', userList, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const login: Handler = async (req: Request, res: Response) => {
  try {
    const { token, user }: any = await UserAPI.login(req.body);
    return logAndRespond(res, 200, 'send', { token, user }, 'info', null, ['token']);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const update: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.update(req.body, req.params.id, token);
    return logAndRespond(res, 200, 'send', user, 'info', null, ['token']);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

// const password: Handler = async (req: Request, res: Response) => {
//   try {
//     const token: any = req.headers.authorization;
//     const user: any = await UserAPI.password(req.body, req.params.id, token);
//     return logAndRespond(res, 200, 'send', user, 'info', null, null);
//   } catch (error) {
//     const e = error as AxiosError;
//     return logAndRespond(res, e.response ? e.response.status : 400, 'json',
//     e.response ? e.response.data : { error: e.message }, 'info', null, null);
//   }
// };

const approve: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.approve(req.params.id, token);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const cancel: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.cancel(req.params.id, token);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const giveAdminPermission: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.giveAdminPermission(req.params.id, token);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const removeAdminPermission: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.removeAdminPermission(req.params.id, token);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const checkUser: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await checkUserFromAPI(token);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const getUser: Handler = async (req: Request, res: Response) => {
  try {
    const token: any = req.headers.authorization;
    const user: any = await UserAPI.getUser(Number(req.params.id), token);
    return logAndRespond(res, 200, 'send', user, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const verifyEmail: Handler = async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token);
    const response: any = await UserAPI.verifyEmail(token);
    return logAndRespond(res, 200, 'send', response, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const recoveryPasswordChange: Handler = async (req: Request, res: Response) => {
  try {
    const { token, password, repeat } = req.body;
    const response: any = await UserAPI.recoveryPasswordChange(token, password, repeat);
    return logAndRespond(res, 200, 'send', response, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const resendVerification: Handler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const response: any = await UserAPI.resendVerification(email);
    return logAndRespond(res, 200, 'send', response, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

const recoverPassword: Handler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const response: any = await UserAPI.recoverPassword(email);
    return logAndRespond(res, 200, 'send', response, 'info', null, null);
  } catch (error) {
    const e = error as AxiosError;
    return logAndRespond(res, e.response ? e.response.status : 400, 'json', e.response ? e.response.data : { error: e.message }, 'info', null, null);
  }
};

router.post('/', create);
router.get('/', listUsers);
router.post('/login', login);
router.put('/verify-email', verifyEmail);
router.put('/password', recoveryPasswordChange);
router.put('/:id', update);
// router.put('/:id/password', password);
router.put('/:id/approve', approve);
router.put('/:id/cancel', cancel);
router.put('/:id/admin', giveAdminPermission);
router.put('/:id/client', removeAdminPermission);
router.post('/check-user', checkUser);
router.get('/:id', getUser);
router.post('/resend-verification', resendVerification);
router.post('/recover-password', recoverPassword);

export default router;
