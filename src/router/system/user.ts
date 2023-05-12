/**
 * 用户接口
 */
import KoaRouter from 'koa-router';

import { userController } from '../../controller';
import { userMiddleware } from '../../middleware';
import verifyAuth from '../../middleware/verifyAuth';

const userRouter = new KoaRouter({ prefix: '/user' });
const {
  accountExist,
  createUser,
  updateUser,
  deleteUser,
  pageUser,
  loginUser,
  resetUser,
  getUserInfo,
  logout,
  changePassword
} = userController;
const { verifyUser, verifyLogin, verifyUserParams } = userMiddleware;

// 登录
userRouter.post('/login', verifyLogin, loginUser);
// 获取用户信息
userRouter.get('/getUserInfo', verifyAuth, getUserInfo);

// 用户是否存在
userRouter.post('/accountExist', verifyAuth, accountExist);

// 新增
userRouter.post('/add', verifyAuth as any, verifyUserParams, createUser);
// 编辑
userRouter.post('/update', verifyAuth as any, verifyUserParams, updateUser);
// 删除
userRouter.post('/delete', verifyAuth, deleteUser);
// 分页查询
userRouter.post('/page', verifyAuth, pageUser);
// 重置密码
userRouter.post('/reset', verifyAuth, resetUser);
// 修改密码
userRouter.post('/changePassword', verifyAuth, changePassword);
// 退出登录
userRouter.get('/logout', verifyAuth, logout);

export default userRouter;
