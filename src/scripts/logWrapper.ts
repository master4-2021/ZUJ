import { FunctionException } from '../common/exceptions';
import { ErrorMessageEnum } from '../common/types';
import { LoggerService } from '../modules/logger/logger.service';

export async function logWrapper<T = any>(
  logger: LoggerService,
  fn: (...args: any[]) => Promise<T>,
  args: any[],
  action: string,
) {
  try {
    const now = Date.now();
    logger.log_(`${action}...`, fn.name);
    const result = await fn(...args);
    logger.log_(`${action} successfully!`, fn.name, {
      result,
      took: `${Date.now() - now} ms`,
    });
    return result;
  } catch (error) {
    logger.error_(`${action} failed!`, error, fn.name);
    throw new FunctionException(ErrorMessageEnum.functionError);
  }
}
