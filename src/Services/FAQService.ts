import { Op } from 'sequelize';
import { FAQDTO } from '../DTOs/FAQDTO';
import FAQ from '../Models/FAQ';

const list = (): Promise<FAQ[]> => FAQ.findAll({
  attributes: ['id', 'question', 'answer', 'position', 'createdAt'],
  where: {
    deletedAt: null,
  },
  order: ['position'],
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
  const { question, answer, position } = createDto;
  const positionFaq: FAQ | null = await FAQ.findOne({
    where: {
      id: {
        [Op.ne]: id,
      },
      position,
      deletedAt: null,
    },
  });
  if (positionFaq) {
    return null;
  }
  return faq.update({
    question, answer, position,
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
