import type { ParameterizedContext } from 'koa';
import { ApiResult } from '../global/constants';
import ErrorTypes from '../global/constants/error_types';
type MapType = Record<string, { msg: string; status: number }>;

export default function errorHandle(
  error: ErrorTypes,
  ctx: ParameterizedContext
) {
  const map: MapType = {
    0: {
      msg: '用户名或密码不能为空',
      status: 400,
    },
    1: {
      msg: '用户名已存在',
      status: 409,
    },
    2: {
      msg: '用户名不存在',
      status: 400,
    },
    3: {
      msg: '密码错误',
      status: 400,
    },
    4: {
      msg: '未授权，token 已过期',
      status: 401,
    },
    5: {
      msg: '某些字段必须有值',
      status: 400,
    },
    6: {
      msg: '该品类和型号的商品已存在',
      status: 400,
    },
    [ErrorTypes.NOT_EXIST_GOOD]: {
      msg: '该品类和型号的商品不存在',
      status: 400,
    },
    [ErrorTypes.OVER_LIMIT]: {
      msg: '输入的商品数量超出最大值',
      status: 400,
    },
    [ErrorTypes.EXIST_POSITION]: {
      msg: '该仓位已存在',
      status: 400,
    },
    [ErrorTypes.NOT_EXIST_POSITION]: {
      msg: '该仓位不存在',
      status: 400,
    },
    [ErrorTypes.NOT_DELETE_POSITION]: {
      msg: '该仓位存在关联的进货单、出货单、销售单，暂时无法删除，请先清空库存后在删除此仓位',
      status: 400,
    },
    [ErrorTypes.OLD_PASSWORD_ERROR]: {
      msg: '旧密码不正确',
      status: 400,
    }
  };

  if (map[error]) {
    console.log('map[error]: ', map[error]);
    ctx.body = ApiResult.error({
      code: map[error].status,
      message: map[error].msg,
    });
    ctx.status = 200;
    return;
  }
  ctx.body = 'NOT FOUND';
  ctx.status = 404;
}
