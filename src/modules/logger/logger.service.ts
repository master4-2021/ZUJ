import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  protected logId: string;
  constructor() {
    super('NestApplication', { timestamp: true });
  }
  log_(
    message: string,
    context = 'NestApplication',
    params?: Record<string, unknown>,
  ) {
    this.callMethod('log', message, context, params);
  }

  debug_(
    message: string,
    context = 'NestApplication',
    params?: Record<string, unknown>,
  ) {
    this.callMethod('debug', message, context, params);
  }

  warn_(
    message: string,
    context = 'NestApplication',
    params?: Record<string, unknown>,
  ) {
    this.callMethod('warn', message, context, params);
  }

  error_(
    message: string,
    error: Error,
    context = 'NestApplication',
    params?: Record<string, unknown>,
  ): void {
    const wrappedError = this.parseError(error);
    this.callMethod('error', message, context, {
      error: wrappedError.message,
      stack: wrappedError.stack,
      ...params,
    });
  }

  private parseError(error: Error): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error(JSON.stringify(error));
  }

  private callMethod(
    method: string,
    message: string,
    context: string,
    params: Record<string, unknown>,
  ) {
    this.setContext(context);
    this[method](
      this.colorize(`[${this.getLogId()}]`, 'warn') +
        ' ' +
        this.colorize(message, method as LogLevel),
    );
    if (params) {
      this.printMessages(
        [
          this.colorize(`[${this.getLogId()}]`, 'warn') +
            ' ' +
            this.colorize('Details :', method as LogLevel) +
            '\n' +
            JSON.stringify(
              params,
              (key, value) =>
                typeof value === 'bigint' ? value.toString() : value,
              2,
            ) +
            '\n',
        ],
        context,
        method as LogLevel,
        method === 'error' ? 'stderr' : 'stdout',
      );
    }
  }

  setLogId(id: string) {
    this.logId = id;
  }

  getLogId() {
    return this.logId;
  }
}
