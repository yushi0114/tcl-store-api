import { formatToDateTime } from '../utils';

/**
 * 仓位管理
 */
import mysql from '../utils/mysql';

import type {
  PositionOrderResultModel,
  Page,
  IUserInfo,
} from '../global/types';
import { buildUUID } from '../utils';
import { LabelValueOptions } from 'types';

class PositionServices {
  isExistOrder(data: PositionOrderResultModel) {
    const { label } = data;
    const res = mysql.actionQuery(
      'position_good',
      `label = '${label}'`
    ) as unknown as any[];
    return res;
  }
  // 新增
  async addPosition(data: PositionOrderResultModel, userInfo: IUserInfo) {
    console.log('data: ', data);
    const id = buildUUID();
    const { userId } = userInfo;
    const res = mysql.actionAdd('position_good', {
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
  editPosition(data: PositionOrderResultModel, userInfo: IUserInfo) {
    const { userId } = userInfo;
    const res = mysql.actionUpdate(
      'position_good',
      { updateBy: userId, updateTime: formatToDateTime(), ...data },
      ['id', data.id!]
    );
    return res;
  }

  // 删除
  deletePosition(id: Required<PositionOrderResultModel['id']>) {
    const res = mysql.actionDelete('position_good', ['id', id!]);
    return res;
  }

  // 获取仓库
  async getPositionList() {
    const res = (await mysql.actionQuery(
      'position_good',
      () => ''
    )) as LabelValueOptions<number>;
    return res;
  }

  // 获取仓库
  async getPositionById(data: PositionOrderResultModel) {
    const res = (await mysql.actionQuery(
      'position_good',
      (tableName) => `${tableName}.id = '${data.id}'`
    )) as LabelValueOptions<number>;
    return res;
  }
}

export default new PositionServices();
