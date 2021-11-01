import { Request, Response, Router } from 'express';
import FAQ from '../Models/FAQ';
import FAQService from '../Services/FAQService';
import { FAQDTO } from '../DTOs/FAQDTO';
import AuthMiddleware from '../Middlewares/authChecker';

const router = Router();

const list = async (req: Request, res: Response): Promise<Response> => {
  try {
    const faqs: FAQ[] = await FAQService.list();
    return res.status(200).send(faqs);
  } catch (error) {
    console.log('error');
    return res.status(400).send('list error');
  }
};

const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: FAQDTO = req.body;
    const newFAQ: FAQ | null = await FAQService.create(dto);
    if (newFAQ) {
      return res.status(200).send(newFAQ);
    }
    return res.status(400).send('create error');
  } catch (error) {
    console.log(error);
    return res.status(400).send('create error');
  }
};

const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: FAQDTO = req.body;
    const faqId = Number(req.params.id);
    const updatedFAQ: FAQ | null = await FAQService.update(faqId, dto);
    if (updatedFAQ) {
      return res.status(200).send(updatedFAQ);
    }
    return res.status(400).send('update error');
  } catch (error) {
    console.log(error);
    return res.status(400).send('update error');
  }
};

const deleteFAQ = async (req: Request, res: Response): Promise<Response> => {
  try {
    const faqId = Number(req.params.id);
    const success: boolean = await FAQService.deleteFAQ(faqId);
    if (success) {
      return res.status(200).send(success);
    }
    return res.status(400).send(success);
  } catch (error) {
    return res.status(400).send('delete error');
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
