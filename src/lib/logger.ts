/**
 * Structured JSON logger for production observability.
 * Output is parsed by log aggregators (Vercel, Datadog, CloudWatch).
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // In production, output clean JSON for log aggregators
  // In development, output human-readable format
  if (process.env.NODE_ENV === "production") {
    console.log(JSON.stringify(entry));
  } else {
    const { timestamp, level: lvl, message: msg, ...rest } = entry;
    const prefix =
      lvl === "error" ? "❌" : lvl === "warn" ? "⚠️" : lvl === "debug" ? "🔍" : "ℹ️";
    console.log(`[${timestamp}] ${prefix} ${msg}`, Object.keys(rest).length ? rest : "");
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => log("error", message, context),
  debug: (message: string, context?: Record<string, unknown>) => log("debug", message, context),

  /**
   * Log a structured admin action for audit trail.
   */
  adminAction: (
    action: string,
    actorId: string,
    entityType: string,
    entityId: string,
    meta: Record<string, unknown> = {}
  ) => {
    log("info", `ADMIN_ACTION:${action}`, {
      actorId,
      entityType,
      entityId,
      action,
      ...meta,
    });
  },
};
