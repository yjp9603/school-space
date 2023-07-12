import { isProductionMode } from './../../utils/env-utils';
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'classum-dev' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (!isProductionMode) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
