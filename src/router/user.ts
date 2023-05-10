/**
 * 用户接口
 */
import KoaRouter from 'koa-router';

import { userController } from '../controller';
import { userMiddleware } from '../middleware';
import verifyAuth from '../middleware/verifyAuth';

const userRouter = new KoaRouter({ prefix: '/user' });
const {
  createUser,
  updateUser,
  deleteUser,
  pageUser,
  loginUser,
  resetUser,
  getUserInfo,
  logout
} = userController;
const { verifyUser, verifyLogin } = userMiddleware;

// 登录
userRouter.post('/login', verifyLogin, loginUser);
// 获取用户信息
userRouter.get('/getUserInfo', verifyAuth, getUserInfo);
// 新增
userRouter.post('/register', verifyAuth as any, verifyUser, createUser);
// 编辑
userRouter.post('/update', verifyAuth, updateUser);
// 删除
userRouter.post('/delete', verifyAuth, deleteUser);
// 分页查询
userRouter.post('/page', verifyAuth, pageUser);
// 重置密码
userRouter.post('/reset', verifyAuth, resetUser);
// 退出登录
userRouter.get('/logout', verifyAuth, logout);

export default userRouter;
