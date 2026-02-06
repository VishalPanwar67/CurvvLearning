// 1. Define Enums for fixed values

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export interface ILog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: any; // Optional field for additional context
}

export class CreateLogDTO {
  message: string;
  level: LogLevel;
  traceId: string | number;
  metadata?: Record<string, any>;

  constructor(
    message: string,
    level: LogLevel,
    traceId: string | number,
    metadata?: Record<string, any>,
  ) {
    this.message = message;
    this.level = level;
    this.traceId = traceId;
    this.metadata = metadata;
  }
}

export class LogResponseDto {
  success: boolean;
  data: ILog;
  count?: number;

  constructor(success: boolean, data: ILog, count?: number) {
    this.success = success;
    this.data = data;
    this.count = count;
  }
}
