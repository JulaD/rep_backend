import { Request, Response, Router } from 'express';
import FAQ from '../Models/FAQ';
import FAQService from '../Services/FAQService';
import { FAQDTO } from '../DTOs/FAQDTO';
import AuthMiddleware from '../Middlewares/authChecker';
import { logAndRespond } from './Utils';

const router = Router();

const list = async (req: Request, res: Response): Promise<Response> => {
  try {
    const faqs: FAQ[] = await FAQService.list();
    return logAndRespond(res, 200, 'send', faqs, 'info', null, null);
  } catch (error) {
    return logAndRespond(res, 400, 'send', 'list error', 'info', null, null);
  }
};

const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: FAQDTO = req.body;
    const newFAQ: FAQ | null = await FAQService.create(dto);
    if (newFAQ) {
      return logAndRespond(res, 200, 'send', newFAQ, 'info', null, null);
    }
    return logAndRespond(res, 400, 'send', 'create error', 'info', null, null);
  } catch (error) {
    return logAndRespond(res, 400, 'send', 'create error', 'info', null, null);
  }
};

const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: FAQDTO = req.body;
    const faqId = Number(req.params.id);
    const updatedFAQ: FAQ | null = await FAQService.update(faqId, dto);
    if (updatedFAQ) {
      return logAndRespond(res, 200, 'send', updatedFAQ, 'info', null, null);
    }
    return logAndRespond(res, 404, 'send', 'update error', 'info', null, null);
  } catch (error) {
    return logAndRespond(res, 400, 'send', 'update error', 'info', null, null);
  }
};

const deleteFAQ = async (req: Request, res: Response): Promise<Response> => {
  try {
    const faqId = Number(req.params.id);
    const success: boolean = await FAQService.deleteFAQ(faqId);
    if (success) {
      logAndRespond(res, 200, 'send', success, 'info', null, null);
    }
    return logAndRespond(res, 404, 'send', 'id not found', 'info', null, null);
  } catch (error) {
    return logAndRespond(res, 400, 'send', 'delete error', 'info', null, null);
  }
};

router
  .get('/', list);

router.use(AuthMiddleware.adminChecker);

router
  .post('/', create);

router
  .put('/:id', update)
  .delete('/:id', deleteFAQ);

export default router;
