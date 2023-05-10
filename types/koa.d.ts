import type { IUserInfo } from './../src/global/types';
import type { Fn, Result } from './index';
import type Koa from 'koa';

declare module 'koa' {
  interface DefaultState {
    useRoutes?: (app: IApplication) => void;
    stateProperty: boolean;
  }

  interface DefaultContext {
    userInfo: IUserInfo;
    success: Fn<Partial<Result>, void>;
    error: Fn<Partial<Result>, void>;
  }
}
declare module 'koa-router' {
  type RouterContext = Koa.ParameterizedContext;
  type IMiddleware = Koa.Middleware;
}
