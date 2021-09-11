import {
  Handler, Request, Response, Router,
} from 'express';
import AgeGroup from '../Models/AgeGroup';
import CalculatorService from '../Services/CalculatorService';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';

const router = Router();

const parseSheet: Handler = async (req: Request, res: Response) => {
  const groups: AgeGroup[] = req.body;
  try {
    const energyRequirement: CalculatorResponse = CalculatorService.calculateREP(groups);
    return res.status(200).send(energyRequirement);
  } catch (error) {
    const e = error as Error;
    return res.status(400).json({ error: e.message });
  }
};

router.post('/', parseSheet);

export default router;
