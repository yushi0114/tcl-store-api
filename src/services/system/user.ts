import mysqlSqlEncapsulation from '../../utils/mysql';

import type { ILogin, IUserInfo, Page } from '../../global/types';
import ErrorTypes from '../../global/constants/error_types';
import type { ParameterizedContext } from 'koa';
import RoleServices from './role';
import { buildUUID, formatToDateTime, md5password } from '../../utils';

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
    )) as IUserInfo[];
    if (!user.length) {
      ctx.app.emit('error', ErrorTypes.USERNAME_NOT_EXISTS, ctx);
      return false;
    }
    // const roles = await RoleServices.getRole({ userId });
    const userInfo = {
      ...user[0],
      roles: [{ label: '', value: user[0].roles }],
    };
    return userInfo;
  }

  // 新增
  async create(
    { username, roles, description, email, realName }: IUserInfo,
    userInfo: IUserInfo
  ) {
    const { userId } = userInfo;
    const id = buildUUID();
    const userRoleId = buildUUID();
    // 用户名唯一
    const res1: any = await actionQuery('user', `username = '${username}'`);
    // 说明找到了，数据库有就不允许在添加了
    if (res1.length) {
      return true;
    }

    const res = actionAdd.call(mysqlSqlEncapsulation, 'user', {
      userId: id,
      username,
      password: md5password('000000'),
      roles,
      realName,
      description,
      email,
      createBy: userId,
      updateBy: userId,
      createTime: formatToDateTime(),
      updateTime: formatToDateTime(),
    });
    // const role = await RoleServices.query({ role: roles });
    // role.length &&
    //   actionAdd.call(mysqlSqlEncapsulation, 'user_role', {
    //     id: userRoleId,
    //     userId: id,
    //     roleId: role[0].roleId,
    //     createBy: userId,
    //     updateBy: userId,
    //     createTime: formatToDateTime(),
    //     updateTime: formatToDateTime(),
    //   });
    return res;
  }

  // 修改
  updateUser(data: IUserInfo, { userId: currentId }: IUserInfo) {
    const { userId, username, roles } = data;
    const obj: Partial<IUserInfo> = {
      ...data,
      updateBy: currentId,
      updateTime: formatToDateTime(),
    };
    username && (obj.username = username);
    roles && (obj.roles = roles);
    const res = actionUpdate.call(mysqlSqlEncapsulation, 'user', obj, [
      'user_id',
      userId!,
    ]);

    return res;
  }

  // 删除
  deleteUser(data: IUserInfo) {
    const res = actionDelete('user', ['user_id', data.userId!]);
    return res;
  }

  // 分页
  pageUser(data: Page) {
    const res = actionPage('user', data);
    return res;
  }

  async query({ userId }: IUserInfo) {
    const res = actionQuery('user', `user_id = '${userId}'`);
    return res;
  }

  // 重置密码
  resetUser(id: string, newPassword: string) {
    const res = mysqlSqlEncapsulation.actionUpdate(
      'user',
      { password: newPassword },
      ['user_id', id]
    );
    return res;
  }
}

export default new UserServices();
