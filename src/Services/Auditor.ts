import { Request, Response } from 'express';
import AgeGroup from '../DTOs/AgeGroupDTO';
import AuditDTO from '../DTOs/AuditDTO';
import Paginator from '../interfaces/paginator.interface';
import Auditor from '../Models/Auditor';
import UserAPI from './UserAPI';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const audit = (request: any, action: string): void => {
  const userId = request.user_id;
  Auditor.create({ user_id: userId, action });
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

const getAudit = async (cant: number, page: number) => {
  const offset = cant * (page - 1);
  const audits: Paginator<Auditor> = await listAudits(cant, offset);
  const ids: number[] = [];
  audits.rows.forEach((auditor: Auditor) => {
    if (!ids.includes(auditor.user_id)) {
      ids.push(auditor.user_id);
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users = await UserAPI.listUsersById({ userIds: ids }) as any[];
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
      date: auditor.time,
      action: auditor.action,
    };
    userAudits.push(userAudit);
  });
  return {
    count: audits.rows.length,
    list: userAudits,
  };
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
};
