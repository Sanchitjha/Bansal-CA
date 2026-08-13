import path from "path";
import winston from "winston";
import { env } from "./env";

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} [${level}] ${stack ?? message}${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: env.nodeEnv === "production" ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: "bansal-associates-server" },
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({ filename: path.join("logs", "combined.log") }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join("logs", "exceptions.log") }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join("logs", "rejections.log") }),
  ],
});

export const httpLogStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};
