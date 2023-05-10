/**
 * 进货单管理
 */
import { saleServices, outerServices, incomeServices } from '../services';
import ErrorTypes from '../global/constants/error_types';

import type { ParameterizedContext, Next } from 'koa';
import type { IncomingOrderResultModel, OuterOrderResultModel, Page } from '../global/types';

class SaleController {
  // 新增
  async addSale(ctx: ParameterizedContext, next: Next) {
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
    const existGood = await outerServices.isExistGood(
      ctx.request.body as OuterOrderResultModel
    );
    if (!existGood.length) {
      ctx.app.emit('error', ErrorTypes.NOT_EXIST_GOOD, ctx);
      return false;
    }

    if (existGood[0].quantity! < quantity!) {
      ctx.app.emit('error', ErrorTypes.OVER_LIMIT, ctx);
      return false;
    }

    await saleServices.addSale(
      ctx.request.body as IncomingOrderResultModel,
      ctx.userInfo
    );

    const goodQuantity = existGood[0].quantity! - quantity!;

    await incomeServices.editIncome(
      { ...existGood[0], quantity: goodQuantity },
      ctx.userInfo
    );

    ctx.success({
      message: '填写销售单成功',
    });
  }

  // 编辑
  async editSale(ctx: ParameterizedContext, next: Next) {
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

    const existOrder = await saleServices.isExistOrder(
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

    await saleServices.editSale(
      ctx.request.body as IncomingOrderResultModel,
      ctx.userInfo
    );
    ctx.success({
      message: '编辑销售单成功',
    });
  }

  // 删除
  async deleteSale(ctx: ParameterizedContext, next: Next) {
    const { id } = ctx.request.body as { id: string };
    if (!id) {
      ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
      return;
    }

    const res = await saleServices.queryOuter(id);
    if (!res.length) {
      ctx.app.emit('error', ErrorTypes.NOT_EXIST_GOOD, ctx);
      return false;
    }

    await saleServices.deleteSale(id);

    const { type, model, position } = res[0];
    const existGood = await outerServices.isExistGood({
      type,
      model,
      position,
    } as OuterOrderResultModel);
    if (existGood.length) {
      const goodQuantity = res[0].quantity! + existGood[0].quantity!;

      await incomeServices.editIncome(
        { ...existGood[0], quantity: goodQuantity },
        ctx.userInfo
      );
    }
    ctx.success({
      message: '删除销售单成功',
    });
  }

  // 分页
  async pageSale(ctx: ParameterizedContext, next: Next) {
    const data = ctx.request.body as Page;

    const res = await saleServices.pageSale(data);
    ctx.success({
      result: {
        items: res?.data ?? [],
        total: res?.total ?? 0,
      },
    });
  }
}

export default new SaleController();
