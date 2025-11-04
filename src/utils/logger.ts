import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;
const myFormat = printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(colorize(), timestamp(), myFormat),
  transports: [new winston.transports.Console()],
});