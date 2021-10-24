// TODO: Set according return types and don't use 'any' explicitly. Nor implicitly.
// Basically don't use 'any' in any context whatsoever. Despite it being the easiest solution.

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

require('dotenv').config();

const instance = axios.create({
  baseURL: process.env.AUTH_BASE_URL,
});

export const validate = (token: string): number => {
  let id = -1;
  instance.post('/validate', { token })
    .then((res) => {
      id = (res.data as any).userId as number;
    })
    .catch((err) => {
      throw (err);
      // if needed implement later
    });
  return id;
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

const password = async (user: any, idUser: string, token: string) => {
  const url = `/${idUser}/password`;
  const res = await instance.put(url, user, { headers: { authorization: token } });
  return res.data;
};

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

const listUsersById = async (userIds: any) => {
  const url = '/usersById';
  const res = await instance.post(url, userIds);
  return res.data;
};

export default {
  create,
  login,
  listUsers,
  update,
  password,
  approve,
  cancel,
  giveAdminPermission,
  removeAdminPermission,
  listUsersById,
};
