// server/observability/logger.ts
import { db } from "../db/db.js";

export const logger = {
  log: (message: string, level: "info" | "warn" | "error" = "info", context?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };
    console.log(`[${logEntry.timestamp}] [${level.toUpperCase()}] ${message}`);
    db.push("logs", logEntry);
  },
  info: (message: string, context?: any) => logger.log(message, "info", context),
  warn: (message: string, context?: any) => logger.log(message, "warn", context),
  error: (message: string, context?: any) => logger.log(message, "error", context)
};
