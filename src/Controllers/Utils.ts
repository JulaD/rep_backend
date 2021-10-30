/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import logger from '../Logger/logger';

// eslint-disable-next-line max-len
export const logAndRespond = (response: any, statusCode: number, method: string, responseBody: any, logLevel: string, error: any, keysToHide: string[]|null): Promise<Response> => {
  const responseBodyToLog = responseBody;
  if (keysToHide !== null) {
    for (let i = 0; i < keysToHide.length; i += 1) {
      if (typeof responseBodyToLog[keysToHide[i]] !== 'undefined') {
        responseBodyToLog[keysToHide[i]] = '__HIDDEN__';
      }
    }
  }
  if (logLevel === 'info') {
    logger.info(`Request responded [HTTP ${statusCode}]`, { response: responseBodyToLog });
  } else if (logLevel === 'warn') {
    logger.warn(`Request responded [HTTP ${statusCode}]`, { response: responseBodyToLog });
  } else if (logLevel === 'error') {
    logger.error(error, { response: responseBodyToLog });
  }
  let res;
  if (method === 'json') {
    res = response.status(statusCode).json(responseBody);
  } else if (method === 'send') {
    res = response.status(statusCode).send(responseBody);
  } else {
    throw new Error('Unknown method');
  }
  return res;
};
