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
      // if needed implement later
    });
  return id;
};
