import jwt from 'jsonwebtoken';
import { formatHumpLineTransfer } from '../utils';
import _ from 'ts-lodash';
import { userServices } from '../services';
import ErrorTypes from '../global/constants/error_types';
import { ApiResult } from '../global/constants';

import md5password from '../utils/md5password';
import { privateContent } from '../config/keysContent';

import type { Next, ParameterizedContext } from 'koa';
import type { ILogin, IUserInfo, Page } from '../global/types';

const { create, updateUser, deleteUser, pageUser, resetUser } = userServices;

class UserController {
  // 登录
  async loginUser(ctx: ParameterizedContext, next: Next) {
    const { username, password } = ctx.request.body as ILogin;
    // 判断用户名是否存在
    const res = (await userServices.loginUser(
      ctx.request.body as ILogin
    )) as Pick<IUserInfo, 'userId' | 'username' | 'password'>[];

    // 说明不存在该用户名
    if (res.length === 0) {
      ctx.app.emit('error', ErrorTypes.USERNAME_NOT_EXISTS, ctx);
      return;
    }
    const loginResult = formatHumpLineTransfer(res[0]);

    // 判断密码是否正确
    if (password !== loginResult.password) {
      // 说明密码错误
      ctx.app.emit('error', ErrorTypes.PASSWORD_ERROR, ctx);
      return;
    }
    // 实现 token
    const token = jwt.sign(loginResult, privateContent, {
      // expiresIn: 60 * 60 * 24 * 30, // 一个月
      expiresIn: 60 * 60 * 24 * 30, // 一个小时
      // algorithm: 'RS256',
    });

    ctx.success({
      result: { ..._.pick(loginResult, ['userId', 'username']), token },
      message: '登陆成功',
    });
  }

  // 获取用户信息
  async getUserInfo(ctx: ParameterizedContext, next: Next) {
    const userInfo = await userServices.getUserInfo(ctx.userInfo, ctx);
    userInfo && Reflect.deleteProperty(userInfo, 'password');
    ctx.success({
      result: userInfo || {},
      message: '获取用户信息成功',
    });
  }

  // 新增
  async createUser(ctx: ParameterizedContext, next: Next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body as IUserInfo;

    const res = await create(user, ctx.userInfo);
    // 用户名存在(唯一性)
    if (res === true) {
      ctx.app.emit('error', ErrorTypes.USERNAME_EXISTS, ctx);
      return;
    }
    // 响应数据
    ctx.success({
      message: '新建成功',
    });
  }

  // 修改
  async updateUser(ctx: ParameterizedContext, next: Next) {
    const userInfo = ctx.request.body as IUserInfo;
    await updateUser(userInfo, ctx.userInfo);
    ctx.success({
      message: '修改成功',
    });
  }

  // 删除
  async deleteUser(ctx: ParameterizedContext, next: Next) {
    const idObj = ctx.request.body as { id: number };
    await deleteUser(idObj);
    ctx.success({
      message: '删除成功',
    });
  }

  // 分页
  async pageUser(ctx: ParameterizedContext, next: Next) {
    const data = ctx.request.body as Page;
    const res = await pageUser(data);
    ctx.success({
      result: {
        items: res?.data,
        total: res?.total,
      },
      message: '查询成功',
    });
  }

  // 重置密码
  async resetUser(ctx: ParameterizedContext, next: Next) {
    const { userId } = ctx.userInfo;
    const finallyPassword = md5password('000000');
    const res = await resetUser(userId!, finallyPassword);

    ctx.success({
      message: '重置密码成功',
    });
  }
  async logout(ctx: ParameterizedContext, next: Next) {
    const { userId } = ctx.userInfo;
    ctx.success({
      result: null,
      message: '退出登陆成功',
    });
  }
}

export default new UserController();
