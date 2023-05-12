/**
 * 用户接口
 */
import KoaRouter from 'koa-router';

import { roleController } from '../../controller';
import { userMiddleware } from '../../middleware';
import verifyAuth from '../../middleware/verifyAuth';

const userRouter = new KoaRouter({ prefix: '/role' });
const {
  createRole,
  getRoleList,
  updateRole,
  deleteRole,
  pageRole
} = roleController;
const { verifyUser } = userMiddleware;

// 获取角色列表
userRouter.get('/list', verifyAuth, getRoleList);
// 新增
userRouter.post('/add', verifyAuth as any, verifyUser, createRole);
// 编辑
userRouter.post('/update', verifyAuth, updateRole);
// 删除
userRouter.post('/delete', verifyAuth, deleteRole);
// 分页查询
userRouter.post('/page', verifyAuth, pageRole);

export default userRouter;
