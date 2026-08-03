import { HKIALogEntryTS } from '../types/native';
import { DateFormatterHelper } from '../utils/DateFormatterHelper';

/**
 * HKIALogger - High-Precision Structured & Procedural Logging Engine.
 *
 * Captures standardized ISO-8601 millisecond timestamps (`yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`)
 * and step-by-step procedural event progressions.
 */
export class HKIALogger {
  private static logBuffer: HKIALogEntryTS[] = [];
  private static maxBuffer = 500;
  private static logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE' = 'INFO';

  static setLogLevel(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE') {
    this.logLevel = level;
  }

  static log(
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    tag: HKIALogEntryTS['tag'],
    step: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    if (this.logLevel === 'NONE') return;

    const entry: HKIALogEntryTS = {
      timestamp: DateFormatterHelper.getIsoTimestamp(),
      epochMs: Date.now(),
      level,
      tag,
      step,
      message,
      metadata,
    };

    if (this.logBuffer.length >= this.maxBuffer) {
      this.logBuffer.shift();
    }
    this.logBuffer.push(entry);

    const logString = `[${entry.timestamp}][${entry.level}][${entry.tag}][${entry.step}] ${entry.message}`;
    if (level === 'ERROR') {
      console.error(logString, metadata || '');
    } else if (level === 'WARN') {
      console.warn(logString, metadata || '');
    } else {
      console.log(logString, metadata || '');
    }
  }

  static info(tag: HKIALogEntryTS['tag'], step: string, message: string, metadata?: Record<string, any>) {
    this.log('INFO', tag, step, message, metadata);
  }

  static warn(tag: HKIALogEntryTS['tag'], step: string, message: string, metadata?: Record<string, any>) {
    this.log('WARN', tag, step, message, metadata);
  }

  static error(tag: HKIALogEntryTS['tag'], step: string, message: string, metadata?: Record<string, any>) {
    this.log('ERROR', tag, step, message, metadata);
  }

  static getLogs(): HKIALogEntryTS[] {
    return [...this.logBuffer];
  }

  static clearLogs() {
    this.logBuffer = [];
  }

  static getFormattedLogsJson(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  static exportLogReportText(): string {
    return this.logBuffer
      .map((e) => `[${e.timestamp}][${e.level}][${e.tag}][${e.step}] ${e.message}`)
      .join('\n');
  }
}
