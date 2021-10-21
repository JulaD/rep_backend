import {
  Handler, Request, Response, Router,
} from 'express';

const router = Router();

const create: Handler = async (req: Request, res: Response) => {
};

const listUsers: Handler = async (req: Request, res: Response) => {

};

const login: Handler = async (req: Request, res: Response) => {

};

const update: Handler = async (req: Request, res: Response) => {

};

const password: Handler = async (req: Request, res: Response) => {

};

const approve: Handler = async (req: Request, res: Response) => {

};

const cancel: Handler = async (req: Request, res: Response) => {

};

const giveAdminPermission: Handler = async (req: Request, res: Response) => {

};

const removeAdminPermission: Handler = async (req: Request, res: Response) => {

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
