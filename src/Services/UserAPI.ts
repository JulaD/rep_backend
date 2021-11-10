// TODO: Set according return types and don't use 'any' explicitly. Nor implicitly.
// Basically don't use 'any' in any context whatsoever. Despite it being the easiest solution.

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

require('dotenv').config();

const instance = axios.create({
  baseURL: process.env.AUTH_BASE_URL,
});

export const validate = async (token: string) => {
  const id = await instance.post('/validate', { token });
  return id.data;
};

const create = async (user: any) => {
  const res = await instance.post('/', user);
  return res.data;
};

const login = async (user: any) => {
  const res = await instance.post('/login', user);
  return res.data;
};

const listUsers = async (userType: any, givenLimit: any, givenOffset: any,
  givenSearch: any, token: string) => {
  const res = await instance.get('/', {
    headers: { authorization: token },
    params: {
      type: userType,
      limit: givenLimit,
      offset: givenOffset,
      search: givenSearch,
    },
  });
  return res.data;
};

const update = async (user: any, idUser: string, token: string) => {
  const url = `/${idUser}`;
  const res = await instance.put(url, user, { headers: { authorization: token } });
  return res.data;
};

// const password = async (user: any, idUser: string, token: string) => {
//   const url = `/${idUser}/password`;
//   const res = await instance.put(url, user, { headers: { authorization: token } });
//   return res.data;
// };

const approve = async (idUser: string, token: string) => {
  const url = `/${idUser}/approve`;
  const res = await instance.put(url, {}, { headers: { authorization: token } });
  return res.data;
};

const cancel = async (idUser: string, token: string) => {
  const url = `/${idUser}/cancel`;
  const res = await instance.put(url, {}, { headers: { authorization: token } });
  return res.data;
};

const giveAdminPermission = async (idUser: string, token: string) => {
  const url = `/${idUser}/admin`;
  const res = await instance.put(url, {}, { headers: { authorization: token } });
  return res.data;
};

const removeAdminPermission = async (idUser: string, token: string) => {
  const url = `/${idUser}/client`;
  const res = await instance.put(url, {}, { headers: { authorization: token } });
  return res.data;
};

const listUsersById = async (userIds: any, token: any) => {
  const url = '/usersById';
  const res = await instance.post(url, userIds, { headers: { authorization: token } });
  return res.data;
};

export const checkUser = async (token: string) => {
  const url = '/check-user';
  const res = await instance.post(url, {}, { headers: { authorization: token } });
  return res.data;
};

const getUser = async (userId: number, token: string) => {
  const url = `/${userId}`;
  const res = await instance.get(url, { headers: { authorization: token } });
  return res.data;
};

const verifyEmail = async (userToken: string) => {
  const url = '/verify-email';
  const res = await instance.put(url, {}, { params: { token: userToken } });
  return res.data;
};

const resendVerification = async (userEmail: string) => {
  const url = '/resend-verification';
  const res = await instance.post(url, { email: userEmail });
  return res.data;
};

const recoverPassword = async (userEmail: string) => {
  const url = '/recover-password';
  const res = await instance.post(url, { email: userEmail });
  return res.data;
};

const recoveryPasswordChange = async (userToken: string, userPassword: string,
  userRepeat: string) => {
  const url = '/password';
  const res = await instance.put(url,
    { token: userToken, password: userPassword, repeat: userRepeat });
  return res.data;
};

export default {
  create,
  login,
  listUsers,
  update,
  // password,
  approve,
  cancel,
  giveAdminPermission,
  removeAdminPermission,
  listUsersById,
  getUser,
  verifyEmail,
  resendVerification,
  recoverPassword,
  recoveryPasswordChange,
};
