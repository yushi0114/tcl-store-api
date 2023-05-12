import mysqlSqlEncapsulation from '../../utils/mysql';
import type { RoleEnum } from '../../global/enums';

import type {
  ILogin,
  IUserInfo,
  IRoleList,
  Page,
  RoleResultModel,
} from '../../global/types';
import ErrorTypes from '../../global/constants/error_types';
import type { ParameterizedContext } from 'koa';

const { actionAdd, actionUpdate, actionDelete, actionPage, actionQuery } =
  mysqlSqlEncapsulation;

class RoleServices {
  // 获取角色信息
  async getRole({ userId }: IUserInfo) {
    let roles: IRoleList = [];
    const userRole = (await actionQuery(
      'user_role',
      `user_id = '${userId}'`
    )) as { role_id: string }[];
    if (userRole.length) {
      const role = (await actionQuery(
        'role',
        `role_id = '${userRole[0].role_id}'`
      )) as { role: RoleEnum; description: string }[];
      role.forEach((item) => {
        roles.push({ label: item.description, value: item.role });
      });
    }

    return roles;
  }

  // 新增
  async create({ username, password, roles, createTime }: IUserInfo) {
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
      createTime,
    });
    return res;
  }

  // 修改
  update({ userId, username, roles }: IUserInfo) {
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
  delete({ id }: { id: number }) {
    const res = actionDelete('user', ['id', id]);
    return res;
  }

  // 分页
  page(data: Page) {
    const res = actionPage('role', data);
    return res;
  }

  async query(data: RoleResultModel) {
    const res = (await actionQuery(
      'role',
      (tableName) => `${tableName}.role = '${data.role}'`
    )) as RoleResultModel[];
    return res;
  }

  // 列表
  async list() {
    let roles: IRoleList = [];
    let roleList = (await actionQuery(
      'role'
    )) as unknown as RoleResultModel[];
    roles = roleList.map((item) => {
      return { label: item.description!, value: item.role! };
    });
    return roles;
  }
}

export default new RoleServices();
