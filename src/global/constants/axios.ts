import type { Result, Nullable } from 'types';
import { ResultEnum } from '../enums';
import { formatHumpLineTransfer } from '../../utils';

export class ApiResult {
  static success<R = any>({
    result = null,
    message,
  }: Partial<Result<Nullable<R>>>) {
    return {
      code: 0,
      success: true,
      result: formatHumpLineTransfer(result),
      message: message ?? '请求成功',
    };
  }

  static error({ code = ResultEnum.ERROR, message }: Partial<Result>) {
    return {
      code,
      success: false,
      result: null,
      message,
    };
  }
}
