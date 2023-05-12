import { formatToDateTime } from '../../utils';

/**
 * 进货单管理
 */
import mysql from '../../utils/mysql';

import type {
  IncomingOrderResultModel,
  Page,
  IUserInfo,
} from '../../global/types';
import { buildUUID } from '../../utils';
import { LabelValueOptions } from 'types';

class IncomeServices {
  isExistOrder(data: IncomingOrderResultModel) {
    const { type, model, position } = data;
    const sql = `${type ? `type = '${type}'` : '1 = 1'}${
      model ? ` and model = '${model}'` : ''
    }${position ? ` and position = '${position}'` : ''}`;
    const res = mysql.actionQuery(
      'incoming_order',
      sql
    ) as unknown as IncomingOrderResultModel[];
    return res;
  }
  // 新增
  async addIncome(data: IncomingOrderResultModel, userInfo: IUserInfo) {
    const id = buildUUID();
    const { userId } = userInfo;
    const res = mysql.actionAdd('incoming_order', {
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
  editIncome(data: IncomingOrderResultModel, userInfo: IUserInfo) {
    const { userId } = userInfo;
    const res = mysql.actionUpdate(
      'incoming_order',
      { updateBy: userId, updateTime: formatToDateTime(), ...data },
      ['id', data.id!]
    );
    return res;
  }

  // 删除
  deleteIncome(id: Required<IncomingOrderResultModel['id']>) {
    const res = mysql.actionDelete('incoming_order', ['id', id!]);
    return res;
  }

  // 分页
  async pageIncome(data: Page) {
    const { pageNum, pageSize, type, model } = data;
    const res = mysql.actionPage('incoming_order', data);
    return res;
  }

  // 获取仓库
  async getPositionList() {
    const res = (await mysql.actionQuery(
      'position_good'
    )) as LabelValueOptions<number>;
    return res;
  }

  // 获取仓库
  async getTypeList() {
    const res = (await mysql.actionQuery(
      'good_type'
    )) as LabelValueOptions<number>;
    return res;
  }
}

export default new IncomeServices();
