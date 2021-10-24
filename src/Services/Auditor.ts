import Auditor from '../Models/Auditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const audit = (request: any, action: string): void => {
  const userId = request.user_id;
  Auditor.create({ user_id: userId, action });
};

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
