import { formatToDateTime } from '../utils';

/**
 * 病例管理
 */
import mysql from '../utils/mysql';

import type {
  OuterOrderResultModel,
  IncomingOrderResultModel,
  Page,
  IUserInfo,
} from '../global/types';
import { buildUUID } from '../utils';
import { ParameterizedContext } from 'koa';
import ErrorTypes from '../global/constants/error_types';

class OuterServices {
  // 商品是否存在
  isExistGood(data: OuterOrderResultModel) {
    const { type, model, position } = data;
    const res = mysql.actionQuery(
      'incoming_order',
      `type = '${type}' and model = '${model}' and position = '${position}'`
    ) as unknown as IncomingOrderResultModel[];
    return res;
  }

  // 新增
  async addOuter(data: OuterOrderResultModel, userInfo: IUserInfo) {
    const id = buildUUID();
    const { userId } = userInfo;
    const res = mysql.actionAdd('outer_order', {
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
  editOuter(data: OuterOrderResultModel, userInfo: IUserInfo) {
    const { userId } = userInfo;
    const res = mysql.actionUpdate(
      'outer_order',
      { updateBy: userId, updateTime: formatToDateTime(), ...data },
      ['id', data.id!]
    );
    return res;
  }

  // 删除
  deleteOuter(id: Required<OuterOrderResultModel['id']>) {
    const res = mysql.actionDelete('outer_order', ['id', id!]);
    return res;
  }

  // 查询出货单
  queryOuter(id: Required<OuterOrderResultModel['id']>) {
    const res = mysql.actionQuery(
      'outer_order',
      `id = '${id}'`
    ) as unknown as OuterOrderResultModel[];
    return res;
  }

  // 分页
  async pageOuter(data: Page) {
    const res = mysql.actionPage('outer_order', data);
    return res;
  }

  // 导出出货单
  async exportOuter(data: OuterOrderResultModel) {
    const { type, model } = data;
    const res = (await mysql.actionQuery('outer_order', (tableName) => {
      let sql = '';
      type && (sql += `${tableName}.type = '${type}'`);
      model && (sql += ` and ${tableName}.model like '%${model}%'`);
      return sql;
    })) as OuterOrderResultModel[];
    return res;
  }
}

export default new OuterServices();
