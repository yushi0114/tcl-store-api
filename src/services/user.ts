import mysqlSqlEncapsulation from '../utils/mysql';

import type { ILogin, IUserInfo, Page } from '../global/types';
import ErrorTypes from '../global/constants/error_types';
import type { ParameterizedContext } from 'koa';
import RoleServices from './role';
import { formatToDateTime } from '../utils'

const { actionAdd, actionUpdate, actionDelete, actionPage, actionQuery } =
  mysqlSqlEncapsulation;

class UserServices {
  // 登录
  async loginUser(loginInfo: ILogin) {
    const { username, password } = loginInfo;
    const res = await actionQuery('user', `username = '${username}'`);
    return res;
  }

  // 获取用户信息
  async getUserInfo(
    { username, userId }: IUserInfo,
    ctx: ParameterizedContext
  ) {
    const user = (await actionQuery(
      'user',
      `username = '${username}'`
    )) as Pick<IUserInfo, 'userId' | 'username' | 'password'>[];
    if (!user.length) {
      ctx.app.emit('error', ErrorTypes.USERNAME_NOT_EXISTS, ctx);
      return false;
    }
    const roles = await RoleServices.getRole({ userId });
    const userInfo = { ...user[0], roles };
    return userInfo;
  }

  // 新增
  async create({ username, password, roles, createTime }: IUserInfo, userInfo: IUserInfo) {
    const { userId } = userInfo;
    // 用户名唯一
    const res1: any = await actionQuery('user', `username = '${username}'`);
    // 说明找到了，数据库有就不允许在添加了
    if (res1.length) {
      return true;
    }

    const res = actionAdd.call(mysqlSqlEncapsulation, 'user', {
      username,
      password,
      roles,
      createBy: userId,
      updateBy: userId,
      createTime: formatToDateTime(),
      updateTime: formatToDateTime(),
    });
    return res;
  }

  // 修改
  updateUser({ userId, username, roles }: IUserInfo, { userId: currentId }: IUserInfo) {
    const obj: Partial<IUserInfo> = {};
    username && (obj.username = username);
    roles && (obj.roles = roles);
    const res = actionUpdate.call(mysqlSqlEncapsulation, 'user', obj, [
      'id',
      userId!,
    ]);

    return res;
  }

  // 删除
  deleteUser({ id }: { id: number }) {
    const res = actionDelete('user', ['id', id]);
    return res;
  }

  // 分页
  pageUser(data: Page) {
    const res = actionPage('user', data);
    return res;
  }

  // 重置密码
  resetUser(id: string, newPassword: string) {
    const res = mysqlSqlEncapsulation.actionUpdate(
      'user',
      { password: newPassword },
      ['id', id]
    );
    return res;
  }
}

export default new UserServices();
