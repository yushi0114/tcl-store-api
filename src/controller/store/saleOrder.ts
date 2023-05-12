/**
 * 进货单管理
 */
import { ExportExcelParams } from 'types';

import { saleServices, outerServices, incomeServices } from '../../services';
import ErrorTypes from '../../global/constants/error_types';

import type { ParameterizedContext, Next } from 'koa';
import type { SaleOrderResultModel, Page } from '../../global/types';
import {
  arrayToObject,
  excelExport,
  formatHumpLineTransfer,
  formatToDateTime,
} from '../../utils';

class SaleController {
  // 新增
  async addSale(ctx: ParameterizedContext, next: Next) {
    const { type, model, quantity, position, price } = ctx.request
      .body as SaleOrderResultModel;
    // 必须有值
    const fieldsArr = [type, model, quantity, position, price];
    for (const field of fieldsArr) {
      if (field === '' || field === undefined || field === null) {
        ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
        return;
      }
    }
    const existGood = await incomeServices.isExistOrder(
      ctx.request.body as SaleOrderResultModel
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
      ctx.request.body as SaleOrderResultModel,
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
      .body as SaleOrderResultModel;
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
      ctx.request.body as SaleOrderResultModel
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
      ctx.request.body as SaleOrderResultModel,
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
    const existGood = await incomeServices.isExistOrder({
      type,
      model,
      position,
    } as SaleOrderResultModel);
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

  // 导出出货单
  async exportSale(ctx: ParameterizedContext, next: Next) {
    const res = await saleServices.exportSale(
      ctx.request.body as SaleOrderResultModel
    );
    console.log(res, 'res');
    const positionList = await incomeServices.getPositionList();
    const typeList = await incomeServices.getTypeList();
    console.log('typeList: ', typeList);

    const exportMap: ExportExcelParams = {
      list: formatHumpLineTransfer(res),
      headerKeys: [
        'id',
        'type',
        'model',
        'quantity',
        'position',
        'price',
        'saleTime',
        'consigneeName',
        'consigneePhone',
        'consigneeAddress',
        'createTime',
        'createBy',
        'updateTime',
        'updateBy',
        'remark',
      ],
      headers: [
        '单号',
        '品类',
        '型号',
        '数量',
        '仓位',
        '价格',
        '销售日期',
        '收货人姓名',
        '收货人电话',
        '收货人地址',
        '出库时间',
        '出库人',
        '更新时间',
        '更新人',
        '备注',
      ],
      changDictExport: {
        type: arrayToObject(typeList),
        position: arrayToObject(positionList),
        createTime: (date: string) => formatToDateTime(date),
        updateTime: (date: string) => formatToDateTime(date),
      },
    };
    const buffer = excelExport(exportMap);
    console.log('buffer: ', buffer);
    // 设置content-type请求头
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // 设置文件名信息请求头
    ctx.set(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('销售单') + '.xlsx'
    );
    // 文件名信息由后端返回时必须设置该请求头,否则前端拿不到Content-Disposition响应头信息
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
    // 将buffer返回给前端
    ctx.body = buffer;
  }
}

export default new SaleController();
