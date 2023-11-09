require('dotenv').config();
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'logger/debug.log',
    }),
  ],
});

module.exports = {
  logger,
};
