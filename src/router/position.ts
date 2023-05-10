/**
 * 仓位接口
 */
import KoaRouter from 'koa-router';

import { positionController } from '../controller';
import verifyAuth from '../middleware/verifyAuth';

const positionRouter = new KoaRouter({ prefix: '/store/position' });
const { addPosition, editPosition, deletePosition, getPositionList } =
  positionController;

// 新增
positionRouter.post('/add', verifyAuth, addPosition);
// 编辑
positionRouter.post('/update', verifyAuth, editPosition);
// 删除
positionRouter.post('/delete', verifyAuth, deletePosition);

// 获取仓库列表
positionRouter.get('/list', verifyAuth, getPositionList);

export default positionRouter;
