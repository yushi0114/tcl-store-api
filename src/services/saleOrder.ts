import { formatToDateTime } from '../utils'

/**
 * 病例管理
 */
import mysql from '../utils/mysql';

import type {
  SaleOrderResultModel,
  Page,
  IUserInfo,
} from '../global/types';
import { buildUUID } from '../utils';

class SaleServices {
  isExistOrder(data: SaleOrderResultModel) {
    const { type, model, position } = data;
    const res = mysql.actionQuery(
      'sale_order',
      `type = '${type}' and model = '${model}' and position = '${position}'`
    ) as unknown as any[];
    return res;
  }
  // 新增
  async addSale(data: SaleOrderResultModel, userInfo: IUserInfo) {
    const id = buildUUID();
    const { userId } = userInfo;
    const res = mysql.actionAdd('sale_order', {
      id,
      ...data,
      createBy: userId,
      updateBy: userId,
      createTime: formatToDateTime(),
      updateTime: formatToDateTime(),
    });
    return res;
  }

  // 编辑
  editSale(data: SaleOrderResultModel, userInfo: IUserInfo) {
    const { userId } = userInfo;
    const res = mysql.actionUpdate('sale_order', { updateBy: userId, updateTime: formatToDateTime(), ...data}, ['id', data.id!]);
    return res;
  }

  // 删除
  deleteSale(id: Required<SaleOrderResultModel['id']>) {
    const res = mysql.actionDelete('sale_order', ['id', id!]);
    return res;
  }

  // 分页
  async pageSale(data: Page) {
    const res = mysql.actionPage('sale_order', data);
    return res;
  }

  // 查询销售单
  queryOuter(id: Required<SaleOrderResultModel['id']>) {
    const res = mysql.actionQuery(
      'sale_order',
      `id = '${id}'`
    ) as unknown as SaleOrderResultModel[];
    return res;
  }
}

export default new SaleServices();
