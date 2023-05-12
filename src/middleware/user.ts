import ErrorTypes from '../global/constants/error_types';

import type { Next, ParameterizedContext } from 'koa';
import type { IUserInfo, ILogin } from '../global/types';
import md5password from '../utils/md5password';

// 判断用户名密码
async function verifyUser(ctx: ParameterizedContext, next: Next) {
  const { username, password, roles } = ctx.request.body as IUserInfo;

  if (!username || !password || !roles) {
    ctx.app.emit('error', ErrorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED, ctx);
    return;
  }

  // 密码加密
  // const finallyPassword = md5password(password);
  // (ctx.request.body as IUserInfo).password = finallyPassword

  // 下一个中间件要有结果才会执行 await 下面的代码
  await next();
}

// 新增用户校验
async function verifyUserParams(ctx: ParameterizedContext, next: Next) {

  // 拿到人员 id
  let { userId, username, roles, realName } = ctx.request.body as IUserInfo;
  if (ctx.request.url.includes('add')) {
    userId = 'true';
  }
  // 必须有值
  const fieldsArr = [userId, username, roles, realName];
  for (const field of fieldsArr) {
    if (field === '' || field === undefined || field === null) {
      ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
      return;
    }
  }
  await next();
}

// 登陆
async function verifyLogin(ctx: ParameterizedContext, next: Next) {
  const { username, password } = ctx.request.body as ILogin;

  // 判断用户名密码是否为空
  if (!username || !password) {
    ctx.app.emit('error', ErrorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED, ctx);
    return;
  }

  await next();
}

const userMiddleware = {
  verifyUser,
  verifyUserParams,
  verifyLogin,
};

export default userMiddleware;
