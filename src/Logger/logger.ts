import {
  createLogger, format, transports, Logger,
} from 'winston';

const {
  combine, timestamp,
} = format;

const logger: Logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File({
      level: 'error',
      filename: 'logs/error-logs',
      maxsize: 104857600, // 100Mb
      maxFiles: 3,
    }),
    new transports.File({
      level: 'info',
      filename: 'logs/info-logs',
      maxsize: 104857600, // 100Mb
      maxFiles: 3,
    }),
  ],
});

export default logger;
