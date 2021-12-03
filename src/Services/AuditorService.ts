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

const calculationAudits = async (userIds: number[], dateFrom: string,
  dateTo: string, isTemplateUsed: boolean): Promise<number> => {
  const whereStatement: any = {};

  if (userIds.length > 0) {
    whereStatement.user_id = userIds;
  }

  if (dateFrom !== '' && dateTo !== '') {
    try {
      // this expression gets the day before the "from" date
      const dayBefore = new Date(dateFrom);
      const to = new Date(new Date(dateTo).valueOf() + 24 * 60 * 60 * 1000);
      whereStatement.createdAt = { [Op.between]: [dayBefore, to] };
    } catch (error) {
      const e = error as Error;
      throw e;
    }
  } else if (dateFrom !== '') {
    try {
      // this expression gets the day before the "from" date
      const dayBefore = new Date(dateFrom);
      whereStatement.createdAt = { [Op.gte]: dayBefore };
    } catch (error) {
      const e = error as Error;
      throw e;
    }
  } else if (dateTo !== '') {
    try {
      const to = new Date(new Date(dateTo).valueOf() + 24 * 60 * 60 * 1000);
      whereStatement.createdAt = { [Op.lte]: to };
    } catch (error) {
      const e = error as Error;
      throw e;
    }
  }

  whereStatement.isTemplateUsed = isTemplateUsed;

  const res = await CalculationAuditor.findAndCountAll({
    attributes: [
      'id', 'user_id', 'isTemplateUsed', 'createdAt',
    ],
    where: whereStatement,
  });

  return res.count;
};

const listAudits = async (limit: number, offset: number, filters: string[]):
Promise<Paginator<Auditor>> => {
  let options = {};
  if (limit >= 1 && offset >= 0) {
    options = {
      limit,
      offset,
    };
  }

  let res: any;
  if (filters.length !== 0) {
    res = await Auditor.findAndCountAll({
      attributes: [
        'id', 'user_id', 'action', 'createdAt',
      ],
      where: {
        [Op.or]: filters,
      },
      order: [['createdAt', 'DESC']],
      ...options,
    });
  } else {
    res = await Auditor.findAndCountAll({
      attributes: [
        'id', 'user_id', 'action', 'createdAt',
      ],
      order: [['createdAt', 'DESC']],
      ...options,
    });
  }

  return res;
};

const getAudit = async (cant: number, page: number, token: any, filters: string[]) => {
  const offset = cant * (page - 1);
  // filters
  let filterArray: string[] = [];
  const actionFilters: any[] = [];
  if (filters) {
    if (typeof filters === 'string') {
      filterArray.push(filters);
    } else {
      filterArray = filters;
    }
  }
  filterArray.forEach((filter) => {
    switch (filter) {
      case ('Cambio de datos por defecto'):
        actionFilters.push({ action: { [Op.startsWith]: 'Cambió' } });
        break;
      case ('Modificación de constantes'):
        actionFilters.push({ action: { [Op.startsWith]: 'Modificó' } });
        break;
      case ('Manejo de acceso a la aplicación'):
        actionFilters.push({ action: { [Op.startsWith]: 'Aceptó' } });
        actionFilters.push({ action: { [Op.startsWith]: 'Rechazó' } });
        break;
      case ('Manejo de permisos de administrador'):
        actionFilters.push({ action: { [Op.startsWith]: 'Otorgó' } });
        actionFilters.push({ action: { [Op.startsWith]: 'Quitó' } });
        break;
      default:
        throw new Error('Invalid filter');
    }
  });

  // audits query
  const audits: Paginator<Auditor> = await listAudits(cant, offset, actionFilters);
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

// BD: UUID // USER ID // ACTION // TIME

export default {
  getAudit,
  getCalculationsAudit,
};
