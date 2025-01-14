const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Custom format for better logging
const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level,
            message,
            ...meta
        });
    })
);

const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, 'logs', 'log-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '50m',
            level: 'info'
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, 'logs', 'errlog-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '50m',
            level: 'error'
        })
    ]
});

module.exports = logger;