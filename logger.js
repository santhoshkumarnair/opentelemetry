const winston = require('winston');
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: '/usr/src/logs/file.log'
        })
    ],
    format: winston.format.combine(
        winston.format.label({
            label: `Empolyee`
        }),
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
       }),
        winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    )
};
const logger = winston.createLogger(logConfiguration);

module.exports = logger;