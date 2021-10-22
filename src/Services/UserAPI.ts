// TODO: Set according return types and don't use 'any' explicitly. Nor implicitly.
// Basically don't use 'any' in any context whatsoever. Despite it being the easiest solution.

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

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

const create = (user: any): any => {
  instance.post('/', user)
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const login = (user: any): any => {
  instance.post('/login', user)
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const listUsers = (requirements: any): any => {
  instance.get('/', requirements)
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const update = (user: any, idUser: string) => {
  const url = `/${idUser}`;
  instance.put(url, user)
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const password = (user: any, idUser: string) => {
  instance.put('/password', user, { params: { id: idUser } })
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const approve = (idUser: string) => {
  instance.put('/approve', { params: { id: idUser } })
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const cancel = (idUser: string) => {
  instance.put('/cancel', { params: { id: idUser } })
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const giveAdminPermission = (idUser: string) => {
  instance.put('/admin', { params: { id: idUser } })
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
};

const removeAdminPermission = (idUser: string) => {
  instance.put('/client', { params: { id: idUser } })
    .then((res) => res)
    .catch((err) => {
      throw (err);
    });
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
};
