import FAQ from '../Models/FAQ';
import { FAQDTO } from '../DTOs/FAQDTO';

const list = (): Promise<FAQ[]> => FAQ.findAll({
  attributes: ['id', 'question', 'answer', 'createdAt'],
  where: {
    deletedAt: null,
  },
});

const create = (createDto: FAQDTO): Promise<FAQ> => FAQ.create(createDto);

const update = async (id: number, createDto: FAQDTO): Promise<FAQ | null> => {
  const faq: FAQ | null = await FAQ.findOne({
    where: {
      id,
      deletedAt: null,
    },
  });
  if (!faq) {
    return null;
  }
  const { question, answer } = createDto;
  return faq.update({
    question, answer,
  });
};

const deleteFAQ = async (id: number): Promise<boolean> => {
  const faq: FAQ | null = await FAQ.findOne({
    where: {
      id,
      deletedAt: null,
    },
  });
  if (!faq) {
    return false;
  }
  await faq.update({
    deletedAt: new Date(),
  });
  return true;
};

export default {
  list,
  create,
  update,
  deleteFAQ,
};
