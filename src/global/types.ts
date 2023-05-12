import { Recordable } from './../../types/global';
import { LabelValueOptions } from './../../types/index';
import type Application from 'koa';
import type { RoleEnum } from './enums';

export interface IUserInfo {
  /**
     * 创建人
     */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 角色
   */
  roles?: RoleEnum;
  /**
   * 更新人
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 用户ID，主键
   */
  userId?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  realName?: string;
  /**
   * 邮箱
   */
  email?: string;
}

/**
 * changePasswordParams
 */
export interface ChangePasswordParams {
  /**
   * 新密码
   */
  passwordNew: string;
  /**
   * 旧密码
   */
  passwordOld: string;
}

export type IRoleList = LabelValueOptions<RoleEnum>;

export type Page<P extends Recordable = Recordable> = {
  pageNum?: number;
  pageSize?: number;
} & P;

export interface ILogin {
  username: string;
  password: string;
}

export interface IApplication extends Application {
  useRoutes?: (app: IApplication) => void;
}

// 人员信息
export interface IOldPersonInfo {
  id?: number;
  oldPersonName?: string;
  gender?: number;
  age?: number;
  birthstring?: string;
  phone?: string;
  address?: string;
  relation?: string;
  isSpouse?: number;
  familyMember?: string;
  familyMemberPhone?: string;
  familyMemberJob?: string;
  createTime?: string;
  updateTime?: string;
  familyMemberAddress?: string;
}

// 健康
export interface IHealthyInfo {
  id?: number;
  oldPersonId?: number;
  PETime?: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  heartRate?: string;
  bloodOxygen?: string;
  bloodPressure?: string;
  isAllergy?: number;
  isSmoke?: number;
  healthyDes?: string;
}

// 病例档案
export interface ICasesInfo {
  id?: number;
  oldPersonId?: number;
  cases?: string;
  fallIllTime?: string;
  isTreat?: number;
  treatDrug?: string;
  drugPrice?: string;
  treatHospital?: string;
}

// 作息时间
export interface IWorkRest {
  id?: number;
  season?: number;
  sevenEight?: string;
  eightNine?: string;
  nineTen?: string;
  tenEleven?: string;
  elevenTwelve?: string;
  twelveFourteen?: string;
  fourteenSeventeen?: string;
  seventeenNineteen?: string;
  nineteenTwentyone?: string;
  twentyoneAfter?: string;
  slogan?: string;
}

// 外出报备
export interface IGoOutInfo {
  id?: number;
  oldPersonId?: number;
  goOutAddress?: string;
  goOutTime?: string;
  goOutEvent?: string;
}

// 入住管理
export interface ILifeInfo {
  id?: number;
  oldPersonId?: number;
  checkInTime?: string;
  bedroomId?: number;
}

// 寝室管理
export interface IBedroomInfo {
  id?: number;
  bedroomNum?: string;
  disPersonNum?: number;
  isFull?: number;
  lived?: number;
  price?: number;
}

// 事故管理
export interface IAccidentInfo {
  id?: number;
  accident?: string;
  accidentTime?: string;
  reason?: string;
  loss?: string;
}

// 访客管理
export interface IVisitorsInfo {
  id?: number;
  oldPersonId?: number;
  visitorsName?: string;
  visitorsPhone?: string;
  visitorsEvent?: string;
  relation?: string;
  accessTime?: string;
}

// 护工管理
export interface ICareWorkerInfo {
  id?: number;
  careWorkerName?: string;
  careWorkerAge?: number;
  carWorkerPrice?: number;
  seniority?: number;
  isHealthy?: number;
  careWorkerCases?: string;
}

/**
 * RoleResultModel
 */
export interface RoleResultModel {
  /**
   * 创建人
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 角色值
   */
  role?: number;
  /**
   * 角色ID
   */
  roleId?: string;
  /**
   * 更新人
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}


/**
 * IncomingOrderResultModel
 * @desc 进货单
 */
export interface IncomingOrderResultModel {
  /**
   * 创建人
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 主键
   */
  id?: string;
  /**
   * 型号
   */
  model?: string;
  /**
   * 仓位
   */
  position?: number;
  /**
   * 单价
   */
  price?: number;
  /**
   * 数量
   */
  quantity?: number;
  /**
   * 品类
   */
  type?: number;
  /**
   * 更新人
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}

/**
 * OuterOrderResultModel
 * @desc 出货单
 */
export interface OuterOrderResultModel {
  /**
   * 收货人地址
   */
  consigneeAddress?: string;
  /**
   * 收货人姓名
   */
  consigneeName?: string;
  /**
   * 收货人电话
   */
  consigneePhone?: string;
  /**
   * 创建人
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 主键
   */
  id?: string;
  /**
   * 型号
   */
  model?: string;
  /**
   * 仓位
   */
  position?: number;
  /**
   * 单价
   */
  price?: number;
  /**
   * 数量
   */
  quantity?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 品类
   */
  type?: number;
  /**
   * 更新人
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}

export interface PositionOrderResultModel {
  id?: string;
  label?: string;
  description?: string;
}

/**
 * SaleOrderResultModel
 */
export interface SaleOrderResultModel {
  /**
   * 收货人地址
   */
  consigneeAddress?: string;
  /**
   * 收货人姓名
   */
  consigneeName?: string;
  /**
   * 收货人电话
   */
  consigneePhone?: string;
  /**
   * 创建人
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 主键
   */
  id?: string;
  /**
   * 型号
   */
  model?: string;
  /**
   * 仓位
   */
  position?: number;
  /**
   * 单价
   */
  price?: number;
  /**
   * 数量
   */
  quantity?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 销售日期
   */
  saleTime?: string;
  /**
   * 品类
   */
  type?: number;
  /**
   * 更新人
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: string;
}
