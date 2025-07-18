export enum LogLevel {
  VERBOSE = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
}

export interface LogLevelConfig {
  getLogLevel(): string;
}

class Logger {
  private level: LogLevel;
  private prefix: string;
  private timestamp: boolean;
  private colors: boolean;
  private namespace?: string;
  private levelConfig?: LogLevelConfig;

  constructor(
    config?: Partial<LoggerConfig>,
    namespace?: string,
    levelConfig?: LogLevelConfig,
  ) {
    // Allow injecting a level config provider to avoid circular dependencies
    this.levelConfig = levelConfig;

    // Get log level from config or default to INFO
    const configLevel = this.levelConfig?.getLogLevel() || "INFO";

    this.level = config?.level ?? this.parseLogLevel(configLevel);

    this.prefix = config?.prefix || "[Magic Button]";
    this.timestamp = config?.timestamp ?? true;
    this.colors = config?.colors ?? true;
    this.namespace = namespace;
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toUpperCase()) {
      case "VERBOSE":
        return LogLevel.VERBOSE;
      case "INFO":
        return LogLevel.INFO;
      case "WARN":
        return LogLevel.WARN;
      case "ERROR":
        return LogLevel.ERROR;
      case "NONE":
        return LogLevel.NONE;
      default:
        return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string): string {
    const parts: string[] = [];

    if (this.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    parts.push(this.prefix);

    if (this.namespace) {
      parts.push(`[${this.namespace}]`);
    }

    parts.push(`[${level}]`);
    parts.push(message);

    return parts.join(" ");
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level && this.level !== LogLevel.NONE;
  }

  verbose(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      console.debug(this.formatMessage("VERBOSE", message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage("INFO", message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage("WARN", message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage("ERROR", message), ...args);
    }
  }

  // Create a child logger with a namespace
  child(namespace: string): Logger {
    const childNamespace = this.namespace
      ? `${this.namespace}:${namespace}`
      : namespace;
    return new Logger(
      {
        level: this.level,
        prefix: this.prefix,
        timestamp: this.timestamp,
        colors: this.colors,
      },
      childNamespace,
      this.levelConfig,
    );
  }

  // Set log level dynamically
  setLevel(level: LogLevel | string): void {
    if (typeof level === "string") {
      this.level = this.parseLogLevel(level);
    } else {
      this.level = level;
    }
  }

  // Get current log level
  getLevel(): LogLevel {
    return this.level;
  }
}

// Create and export default logger instance
const logger = new Logger();

// Export factory function for creating namespaced loggers
export function createLogger(
  namespace: string,
  config?: Partial<LoggerConfig>,
): Logger {
  return new Logger(config, namespace);
}

// Export factory for creating logger with config provider
export function createLoggerWithConfig(
  levelConfig: LogLevelConfig,
  namespace?: string,
  config?: Partial<LoggerConfig>,
): Logger {
  return new Logger(config, namespace, levelConfig);
}

// Export default logger
export default logger;

// Re-export Logger class for type usage
export { Logger };
