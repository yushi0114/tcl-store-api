import _ from 'ts-lodash';
import { roleServices } from '../../services';
import ErrorTypes from '../../global/constants/error_types';

import type { Next, ParameterizedContext } from 'koa';
import type { RoleResultModel, Page } from '../../global/types';

class RoleController {

  // 获取角色列表
  async getRoleList(ctx: ParameterizedContext, next: Next) {
    const roleList = await roleServices.list();
    ctx.success({
      result: roleList || [],
      message: '获取角色列表成功',
    });
  }

  // 新增
  async createRole(ctx: ParameterizedContext, next: Next) {
    // 获取用户请求传递的参数
    const role = ctx.request.body as RoleResultModel;

    const res = await roleServices.create(role);
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
  async updateRole(ctx: ParameterizedContext, next: Next) {
    const roleInfo = ctx.request.body as RoleResultModel;
    await roleServices.update(roleInfo);
    ctx.success({
      message: '修改成功',
    });
  }

  // 删除
  async deleteRole(ctx: ParameterizedContext, next: Next) {
    const idObj = ctx.request.body as { id: number };
    await roleServices.delete(idObj);
    ctx.success({
      message: '删除成功',
    });
  }

  // 分页
  async pageRole(ctx: ParameterizedContext, next: Next) {
    const data = ctx.request.body as Page;
    const res = await roleServices.page(data);
    ctx.success({
      result: {
        items: res?.data,
        total: res?.total,
      },
      message: '查询成功',
    });
  }
}

export default new RoleController();
