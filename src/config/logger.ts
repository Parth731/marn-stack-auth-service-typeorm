import winston from 'winston';
import { Config } from './index.js';

/**
 * 
 * Similarly, npm logging levels are prioritized from 0 to 6 (highest to lowest):

{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
 */

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: {
    serviceName: 'auth-service',
  },
  transports: [
    new winston.transports.File({
      dirname: 'logs',
      filename: 'combined.log',
      level: 'info',
      silent: Config.NODE_ENV === 'test',
    }),
    new winston.transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
      silent: Config.NODE_ENV === 'test',
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: Config.NODE_ENV === 'test',
    }),
  ],
});

export default logger;
