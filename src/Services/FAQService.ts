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

const correctFAQs = async (faqs: FAQ[]): Promise<void> => new Promise((resolve, reject) => {
  const { length } = faqs;
  const sorted: FAQ[] = faqs.sort((faqA: FAQ, faqB: FAQ) => Number(faqA.get('position')) - Number(faqB.get('position')));
  const promises: Promise<FAQ>[] = [];
  for (let index = 0; index < length; index += 1) {
    const faq: FAQ = sorted[index];
    promises.push(faq.update({
      position: index + 1,
    }));
  }
  return Promise.all(promises)
    .then(() => resolve())
    .catch(() => reject());
});

const create = async (createDto: FAQDTO): Promise<FAQ> => {
  const faqs: FAQ[] = await FAQ.findAll({
    where: {
      deletedAt: null,
    },
    order: ['position'],
  });
  const newFaq: FAQ = await FAQ.create(createDto);
  if (faqs.length + 1 === Number(newFaq.get('position'))) {
    newFaq.set('position', Number(newFaq.get('position')) + 0.5);
  } else {
    newFaq.set('position', Number(newFaq.get('position')) - 0.5);
  }

  faqs.push(newFaq);
  await correctFAQs(faqs);

  return newFaq;
};

const update = async (id: number, createDto: FAQDTO): Promise<FAQ | null> => {
  const toUpdate: FAQ | null = await FAQ.findOne({
    where: {
      id,
      deletedAt: null,
    },
  });
  if (!toUpdate) {
    return null;
  }
  const { question, answer, position } = createDto;
  await toUpdate.update({
    question, answer, position,
  });

  const faqs: FAQ[] = await FAQ.findAll({
    where: {
      id: {
        [Op.not]: Number(toUpdate.get('id')),
      },
      deletedAt: null,
    },
    order: ['position'],
  });

  if (faqs.length + 1 === Number(toUpdate.get('position'))) {
    toUpdate.set('position', Number(toUpdate.get('position')) + 0.5);
  } else {
    toUpdate.set('position', Number(toUpdate.get('position')) - 0.5);
  }

  faqs.push(toUpdate);
  await correctFAQs(faqs);

  return toUpdate;
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

  const faqs: FAQ[] = await FAQ.findAll({
    where: {
      deletedAt: null,
    },
    order: ['position'],
  });
  await correctFAQs(faqs);

  return true;
};

export default {
  list,
  create,
  update,
  deleteFAQ,
};
