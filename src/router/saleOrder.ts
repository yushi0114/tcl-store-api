/**
 * 进货单接口
 */
import KoaRouter from 'koa-router';

import { saleOrderController } from '../controller';
import verifyAuth from '../middleware/verifyAuth';

const saleRouter = new KoaRouter({ prefix: '/store/sale' });
const {
  addSale,
  editSale,
  deleteSale,
  pageSale,
} = saleOrderController;

// 新增
saleRouter.post('/add', verifyAuth, addSale);
// 编辑
saleRouter.post('/update', verifyAuth, editSale);
// 删除
saleRouter.post('/delete', verifyAuth, deleteSale);
// 分页查询
saleRouter.post('/list', verifyAuth, pageSale);

export default saleRouter;
