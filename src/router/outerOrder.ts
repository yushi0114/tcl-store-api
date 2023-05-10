/**
 * 进货单接口
 */
import KoaRouter from 'koa-router';

import { outerController } from '../controller';
import verifyAuth from '../middleware/verifyAuth';

const outerRouter = new KoaRouter({ prefix: '/store/outer' });
const {
  addOuter,
  editOuter,
  deleteOuter,
  pageOuter,
  exportOuter
} = outerController;

// 新增
outerRouter.post('/add', verifyAuth, addOuter);
// 编辑
outerRouter.post('/update', verifyAuth, editOuter);
// 删除
outerRouter.post('/delete', verifyAuth, deleteOuter);
// 分页查询
outerRouter.post('/list', verifyAuth, pageOuter);

// 导出
outerRouter.post('/export', verifyAuth, exportOuter);

export default outerRouter;
