/**
 * 进货单管理
 */
import { incomeServices } from '../../services';
import ErrorTypes from '../../global/constants/error_types';

import type { ParameterizedContext, Next } from 'koa';
import type { IncomingOrderResultModel, Page } from '../../global/types';

class IncomeController {
  // 新增
  async addIncome(ctx: ParameterizedContext, next: Next) {
    const { type, model, quantity, position, price } = ctx.request
      .body as IncomingOrderResultModel;
    // 必须有值
    const fieldsArr = [type, model, quantity, position, price];
    for (const field of fieldsArr) {
      if (field === '' || field === undefined || field === null) {
        ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
        return;
      }
    }
    const existOrder = await incomeServices.isExistOrder(
      ctx.request.body as IncomingOrderResultModel
    );
    if (existOrder.length) {
      ctx.app.emit('error', ErrorTypes.EXIST_GOOD, ctx);
      return false;
    }

    await incomeServices.addIncome(
      ctx.request.body as IncomingOrderResultModel,
      ctx.userInfo
    );
    ctx.success({
      message: '入库成功',
    });
  }

  // 编辑
  async editIncome(ctx: ParameterizedContext, next: Next) {
    const { id, type, model, quantity, position, price } = ctx.request
      .body as IncomingOrderResultModel;
    // 必须有值
    const fieldsArr = [type, model, quantity, position, price];
    for (const field of fieldsArr) {
      if (field === '' || field === undefined || field === null) {
        ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
        return;
      }
    }
    if (!id) {
      ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
      return;
    }

    const existOrder = await incomeServices.isExistOrder(
      ctx.request.body as IncomingOrderResultModel
    );
    if (
      existOrder.length &&
      type !== existOrder[0].type &&
      model !== existOrder[0].model
    ) {
      ctx.app.emit('error', ErrorTypes.EXIST_GOOD, ctx);
      return false;
    }

    await incomeServices.editIncome(
      ctx.request.body as IncomingOrderResultModel,
      ctx.userInfo
    );
    ctx.success({
      message: '编辑成功',
    });
  }

  // 删除
  async deleteIncome(ctx: ParameterizedContext, next: Next) {
    const { id } = ctx.request.body as { id: string };
    if (!id) {
      ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
      return;
    }

    await incomeServices.deleteIncome(id);
    ctx.success({
      message: '删除成功',
    });
  }

  // 分页
  async pageIncome(ctx: ParameterizedContext, next: Next) {
    const data = ctx.request.body as Page;

    const res = await incomeServices.pageIncome(data);
    ctx.success({
      result: {
        items: res?.data ?? [],
        total: res?.total ?? 0,
      },
    });
  }

  // 获取仓库列表
  async getPositionList(ctx: ParameterizedContext, next: Next) {
    const res = await incomeServices.getPositionList();
    ctx.success({
      result: res,
    });
  }

  // 获取品类列表
  async getTypeList(ctx: ParameterizedContext, next: Next) {
    const res = await incomeServices.getTypeList();
    ctx.success({
      result: res,
    });
  }
}

export default new IncomeController();
