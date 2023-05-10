/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Koa from 'koa';
import type { Result } from '../../types';
import { ApiResult } from '../global/constants';

const koaResponse = async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.success = ({ result, message }: Partial<Result>): void => {
    ctx.status = 200;
    ctx.body = ApiResult.success({ result, message });
  };

  ctx.error = ({ code, message }: Partial<Result>): void => {
    ctx.status = 200;
    ctx.body = ApiResult.error({ code, message });
  };

  await next();
};

export default koaResponse;
