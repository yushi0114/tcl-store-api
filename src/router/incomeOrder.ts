/**
 * 进货单接口
 */
import KoaRouter from 'koa-router';

import { incomeController } from '../controller';
import verifyAuth from '../middleware/verifyAuth';

const incomeRouter = new KoaRouter({ prefix: '/store/income' });
const {
  addIncome,
  editIncome,
  deleteIncome,
  pageIncome,
  getPositionList,
  getTypeList
} = incomeController;

// 新增
incomeRouter.post('/add', verifyAuth, addIncome);
// 编辑
incomeRouter.post('/update', verifyAuth, editIncome);
// 删除
incomeRouter.post('/delete', verifyAuth, deleteIncome);
// 分页查询
incomeRouter.post('/list', verifyAuth, pageIncome);
// 获取仓库列表
incomeRouter.get('/position', verifyAuth, getPositionList);
// 获取品类列表
incomeRouter.get('/type', verifyAuth, getTypeList);

export default incomeRouter;
