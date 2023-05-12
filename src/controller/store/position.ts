/**
 * 进货单管理
 */
import { positionServices, incomeServices, outerServices, saleServices } from '../../services';
import ErrorTypes from '../../global/constants/error_types';
import _ from 'ts-lodash';

import type { ParameterizedContext, Next } from 'koa';
import type { PositionOrderResultModel, Page } from '../../global/types';

class PositionController {
  // 新增
  async addPosition(ctx: ParameterizedContext, next: Next) {
    const { label } = ctx.request.body as PositionOrderResultModel;
    // 必须有值
    const fieldsArr = [label];
    for (const field of fieldsArr) {
      if (field === '' || field === undefined || field === null) {
        ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
        return;
      }
    }
    const existOrder = await positionServices.isExistOrder(
      ctx.request.body as PositionOrderResultModel
    );
    if (existOrder.length) {
      ctx.app.emit('error', ErrorTypes.EXIST_POSITION, ctx);
      return false;
    }

    const positionList = await positionServices.getPositionList();
    const maxValue = positionList.length
      ? Math.max(...positionList.map((item) => item.value))
      : 0;

    await positionServices.addPosition(
      {
        ...(ctx.request.body ?? {}),
        value: maxValue + 1,
      } as PositionOrderResultModel,
      ctx.userInfo
    );
    ctx.success({
      message: '新建仓位成功',
    });
  }

  // 编辑
  async editPosition(ctx: ParameterizedContext, next: Next) {
    const { id, label, description } = ctx.request
      .body as PositionOrderResultModel;
    // 必须有值
    const fieldsArr = [label];
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

    const oldPosition = await positionServices.getPositionById(
      ctx.request.body as PositionOrderResultModel
    );

    const existOrder = await positionServices.isExistOrder(
      ctx.request.body as PositionOrderResultModel
    );
    if (existOrder.length && oldPosition[0].label !== existOrder[0].label) {
      ctx.app.emit('error', ErrorTypes.EXIST_POSITION, ctx);
      return false;
    }

    await positionServices.editPosition(
      _.pick(ctx.request.body, [
        'label',
        'description',
        'id',
      ]) as PositionOrderResultModel,
      ctx.userInfo
    );
    ctx.success({
      message: '编辑成功',
    });
  }

  // 删除
  async deletePosition(ctx: ParameterizedContext, next: Next) {
    const { id } = ctx.request.body as { id: string };
    if (!id) {
      ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
      return;
    }

    const position = await positionServices.getPositionById({ id });

    if (!position.length) {
      ctx.app.emit('error', ErrorTypes.NOT_EXIST_POSITION, ctx);
      return false;
    }
    const incomeOrder = await incomeServices.isExistOrder({ position: position[0].value });
    const outerOrder = await outerServices.isExistOrder({ position: position[0].value });
    const saleOrder = await saleServices.isExistOrder({ position: position[0].value });

    if (incomeOrder.length || outerOrder.length || saleOrder.length) {
      ctx.app.emit('error', ErrorTypes.NOT_DELETE_POSITION, ctx);
      return false;
    }
    await positionServices.deletePosition(id);
    ctx.success({
      message: '删除成功',
    });
  }

  // 获取仓库列表
  async getPositionList(ctx: ParameterizedContext, next: Next) {
    const res = await positionServices.getPositionList();
    ctx.success({
      result: res,
    });
  }
}

export default new PositionController();
