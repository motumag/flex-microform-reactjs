import { LogLevel } from "../types";

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.logs = [];
  }

  log(level, message, data = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);

    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Console logging in development
    if (this.isDevelopment) {
      const consoleMethod = this.getConsoleMethod(level);
      const formattedMessage = `[${level.toUpperCase()}] ${message}`;

      if (data) {
        consoleMethod(formattedMessage, data);
      } else {
        consoleMethod(formattedMessage);
      }
    }

    return logEntry;
  }

  info(message, data = null) {
    return this.log(LogLevel.INFO, message, data);
  }

  success(message, data = null) {
    return this.log(LogLevel.SUCCESS, message, data);
  }

  warning(message, data = null) {
    return this.log(LogLevel.WARNING, message, data);
  }

  error(message, data = null) {
    return this.log(LogLevel.ERROR, message, data);
  }

  getConsoleMethod(level) {
    switch (level) {
      case LogLevel.ERROR:
        return console.error;
      case LogLevel.WARNING:
        return console.warn;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.SUCCESS:
        return console.log;
      default:
        return console.log;
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      logs: this.logs,
      environment: process.env.NODE_ENV,
      userAgent: navigator.userAgent,
    };
  }
}

// Create singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { info, success, warning, error, getLogs, clearLogs, exportLogs } = logger;
