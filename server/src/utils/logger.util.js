const path = require("path");
const winston = require("winston");
const { combine, timestamp, printf } = winston.format;
require("winston-daily-rotate-file");

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "error-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      level: "error",
      dirname: path.join(__dirname, "../../temp/logs/errors"),
      maxSize: "5m",
      maxFiles: "7d",
      format: combine(
        errorFilter(),
        timestamp({
          format: "DD-MM-YYYY hh:mm:ss A",
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: "%DATE%.log",
      datePattern: "DD-MM-YYYY",
      level: "info",
      dirname: path.join(__dirname, "../../temp/logs/"),
      maxSize: "5m",
      maxFiles: "7d",
      format: combine(
        infoFilter(),
        timestamp({
          format: "DD-MM-YYYY hh:mm:ss A",
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
    new winston.transports.Console({
      level: "info",
      format: combine(
        timestamp({
          format: "DD-MM-YYYY hh:mm:ss A",
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
  ],
});

module.exports = logger;
