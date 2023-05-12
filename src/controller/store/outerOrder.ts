/**
 * 进货单管理
 */
import { ExportExcelParams } from 'types';
import { outerServices, incomeServices } from '../../services';
import ErrorTypes from '../../global/constants/error_types';

import type { ParameterizedContext, Next } from 'koa';
import type { OuterOrderResultModel, Page } from '../../global/types';
import {
  arrayToObject,
  excelExport,
  formatHumpLineTransfer,
  formatToDateTime,
} from '../../utils';

class OuterController {
  // 新增
  async addOuter(ctx: ParameterizedContext, next: Next) {
    const {
      type,
      model,
      quantity,
      position,
      consigneeAddress,
      consigneeName,
      consigneePhone,
    } = ctx.request.body as OuterOrderResultModel;
    // 必须有值
    const fieldsArr = [
      type,
      model,
      quantity,
      position,
      consigneeAddress,
      consigneeName,
      consigneePhone,
    ];
    for (const field of fieldsArr) {
      if (field === '' || field === undefined || field === null) {
        ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
        return;
      }
    }
    const existGood = await incomeServices.isExistOrder(
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

    await outerServices.addOuter(
      ctx.request.body as OuterOrderResultModel,
      ctx.userInfo
    );

    const goodQuantity = existGood[0].quantity! - quantity!;

    await incomeServices.editIncome(
      { ...existGood[0], quantity: goodQuantity },
      ctx.userInfo
    );
    ctx.success({
      message: '出库成功',
    });
  }

  // 编辑
  async editOuter(ctx: ParameterizedContext, next: Next) {
    const { id, quantity, consigneeAddress, consigneeName, consigneePhone } =
      ctx.request.body as OuterOrderResultModel;
    // 必须有值
    const fieldsArr = [consigneeAddress, consigneeName, consigneePhone];
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

    const existGood = await incomeServices.isExistOrder(
      ctx.request.body as OuterOrderResultModel
    );
    if (!existGood.length) {
      ctx.app.emit('error', ErrorTypes.NOT_EXIST_GOOD, ctx);
      return false;
    }

    await outerServices.editOuter(
      {
        id,
        consigneeAddress,
        consigneeName,
        consigneePhone,
      } as OuterOrderResultModel,
      ctx.userInfo
    );
    ctx.success({
      message: '编辑成功',
    });
  }

  // 删除
  async deleteOuter(ctx: ParameterizedContext, next: Next) {
    const { id } = ctx.request.body as { id: string };
    if (!id) {
      ctx.app.emit('error', ErrorTypes.REQUIRE_HAVA_VALUE, ctx);
      return false;
    }
    const res = await outerServices.queryOuter(id);
    if (!res.length) {
      ctx.app.emit('error', ErrorTypes.NOT_EXIST_GOOD, ctx);
      return false;
    }

    await outerServices.deleteOuter(id);
    const { type, model, position } = res[0];
    const existGood = await incomeServices.isExistOrder({
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
      message: '删除成功',
    });
  }

  // 分页
  async pageOuter(ctx: ParameterizedContext, next: Next) {
    const data = ctx.request.body as Page;

    const res = await outerServices.pageOuter(data);
    ctx.success({
      result: {
        items: res?.data ?? [],
        total: res?.total ?? 0,
      },
    });
  }

  // 导出出货单
  async exportOuter(ctx: ParameterizedContext, next: Next) {
    const res = await outerServices.exportOuter(
      ctx.request.body as OuterOrderResultModel
    );
    console.log(res, 'res');
    const positionList = await incomeServices.getPositionList();
    const typeList = await incomeServices.getTypeList();
    console.log('typeList: ', typeList);

    const exportMap: ExportExcelParams = {
      list: formatHumpLineTransfer(res),
      headerKeys: [
        'type',
        'model',
        'quantity',
        'position',
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
        '品类',
        '型号',
        '数量',
        '仓位',
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
      'attachment; filename=' + encodeURIComponent('出货单') + '.xlsx'
    );
    // 文件名信息由后端返回时必须设置该请求头,否则前端拿不到Content-Disposition响应头信息
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
    // 将buffer返回给前端
    ctx.body = buffer;
  }
}

export default new OuterController();
