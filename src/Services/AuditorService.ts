// TODO: Get rid of all the 'any' mentions
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Op } from 'sequelize';
import AuditDTO from '../DTOs/AuditDTO';
import Paginator from '../interfaces/paginator.interface';
import Auditor from '../Models/Auditor';
import CalculationAuditor from '../Models/CalculationAuditor';
import UserAPI from './UserAPI';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const audit = (request: any, action: string): void => {
  const userId = request.user_id;
  Auditor.create({ user_id: userId, action });
};

export const calculationAudit = (request: any, templateUsed: boolean): void => {
  const userId = request.user_id;
  CalculationAuditor.create({ user_id: userId, isTemplateUsed: templateUsed });
};

const listAudits = async (limit: number, offset: number): Promise<Paginator<Auditor>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    options = {
      limit,
      offset,
    };
  }
  const res = await Auditor.findAndCountAll({
    attributes: [
      'id', 'user_id', 'action', 'createdAt',
    ],
    ...options,
  });
  return res;
};

const calculationAudits = async (userIds: number[], dateFrom: string,
  dateTo: string, isTemplateUsed: boolean) => {
  const whereStatement: any = {};

  if (userIds.length > 0) {
    whereStatement.user_id = userIds;
  }

  if (dateFrom !== '' && dateTo !== '') {
    try {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      whereStatement.createdAt = { [Op.between]: [from, to] };
    } catch (error) {
      const e = error as Error;
      throw e;
    }
  }

  whereStatement.isTemplateUsed = isTemplateUsed;

  const res = await CalculationAuditor.count({
    attributes: [
      'id', 'user_id', 'isTemplateUsed', 'createdAt',
    ],
    where: whereStatement,
  });

  return res;
};

const getAudit = async (cant: number, page: number, token: any) => {
  const offset = cant * (page - 1);
  const audits: Paginator<Auditor> = await listAudits(cant, offset);
  const ids: number[] = [];
  audits.rows.forEach((auditor: Auditor) => {
    if (!ids.includes(auditor.user_id)) {
      ids.push(auditor.user_id);
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users = await UserAPI.listUsersById({ userIds: ids }, token) as any[];
  const usersMap: Map<number, any> = new Map();
  users.forEach((user) => {
    usersMap.set(user.id, user);
  });
  const userAudits: AuditDTO[] = [];
  audits.rows.forEach((auditor) => {
    const user = usersMap.get(auditor.user_id);
    const userAudit: AuditDTO = {
      id: auditor.id,
      email: user.email,
      user_name: user.name,
      organization_name: user.organization,
      date: auditor.createdAt,
      action: auditor.action,
    };
    userAudits.push(userAudit);
  });
  return {
    count: audits.count,
    list: userAudits,
  };
};

const getCalculationsAudit = async (userIds: number[], dateFrom: string, dateTo: string) => {
  const calculationsByHand: number = await calculationAudits(userIds, dateFrom, dateTo, false);
  const calculationsWithTemplate: number = await calculationAudits(userIds, dateFrom, dateTo, true);

  return [
    {
      name: 'Cálculos a mano',
      value: calculationsByHand,
      extra: {
        code: 'cam',
      },
    },
    {
      name: 'Cálculos usando plantilla',
      value: calculationsWithTemplate,
      extra: {
        code: 'cup',
      },
    },
  ];
};

// {
// count:number,
// list:[{id,user_name,full_name, organization_name, date, action}]
// }

// export const getAudit = (cant: number, page: number) => {
//   const init = (cant * page) - cant;
//   const end = cant * page;
//   Auditor.findAll({
//     where: {
//       ageRange: ageBracket as string,
//       sex: sex as string,
//     },
//     order: [['order', 'ASC']],
//   })
// };

// BD: UUID // USER ID // ACTION // TIME

export default {
  getAudit,
  getCalculationsAudit,
};
