/**
 * Logger utility for frontend
 * Provides environment-based logging with different log levels
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Determine current log level based on environment
const getLogLevel = () => {
  if (typeof window === 'undefined') return LOG_LEVELS.NONE; // SSR
  
  const env = process.env.NODE_ENV || 'development';
  const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || (env === 'production' ? 'warn' : 'debug');
  
  return LOG_LEVELS[logLevel.toUpperCase()] ?? LOG_LEVELS.INFO;
};

const currentLogLevel = getLogLevel();

/**
 * Logger class
 */
class Logger {
  debug(...args) {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args) {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args) {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args) {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error('[ERROR]', ...args);
    }
    // In production, you might want to send errors to a logging service
    // Example: Sentry.captureException(new Error(args.join(' ')));
  }

  log(...args) {
    // Alias for info
    this.info(...args);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default
export default logger;
