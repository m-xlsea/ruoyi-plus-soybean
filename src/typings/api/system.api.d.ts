/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace System
   *
   * backend api module: "system"
   */
  namespace System {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'pageNum' | 'pageSize'>;

    /** role */
    type Role = Common.CommonRecord<{
      roleId: CommonType.IdType;
      roleName: string;
      roleKey: string;
      roleSort: number;
      dataScope: string;
      menuCheckStrictly: boolean;
      deptCheckStrictly: boolean;
      status: string;
      delFlag: string;
      remark?: any;
      flag: boolean;
      menuIds?: Array<CommonType.IdType>;
      deptIds?: Array<CommonType.IdType>;
      admin: boolean;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Role, 'roleName' | 'roleKey' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'roleId' | 'roleName' | 'roleKey'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonTenantRecord<{
      /** 用户ID */
      userId?: CommonType.IdType;
      /** 部门ID */
      deptId?: CommonType.IdType;
      /** 用户账号 */
      userName?: string;
      /** 用户昵称 */
      nickName?: string;
      /** 用户类型（sys_user系统用户） */
      userType?: string;
      /** 用户邮箱 */
      email?: string;
      /** 手机号码 */
      phonenumber?: string;
      /** 用户性别（0男 1女 2未知） */
      sex?: string;
      /** 头像地址 */
      avatar?: number;
      /** 密码 */
      password?: string;
      /** 帐号状态（0正常 1停用） */
      status?: string;
      /** 删除标志（0代表存在 2代表删除） */
      delFlag?: string;
      /** 最后登录IP */
      loginIp?: string;
      /** 最后登录时间 */
      loginDate?: Date;
      /** 备注 */
      remark?: string;
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<User, 'userName' | 'sex' | 'nickName' | 'phonenumber' | 'email' | 'status'> & CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** tenant */
    interface Tenant {
      /** id */
      id?: CommonType.IdType;
      /** 租户编号 */
      tenantId?: string;
      /** 联系人 */
      contactUserName?: string;
      /** 联系电话 */
      contactPhone?: string;
      /** 企业名称 */
      companyName?: string;
      /** 统一社会信用代码 */
      licenseNumber?: string;
      /** 地址 */
      address?: string;
      /** 域名 */
      domain?: string;
      /** 企业简介 */
      intro?: string;
      /** 备注 */
      remark?: string;
      /** 租户套餐编号 */
      packageId?: number;
      /** 过期时间 */
      expireTime?: Date;
      /** 用户数量（-1不限制） */
      accountCount?: number;
      /** 租户状态（0正常 1停用） */
      status?: string;
      /** 删除标志（0代表存在 2代表删除） */
      delFlag: string;
    }

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    /**
     * menu type
     *
     * - "M": "目录"
     * - "C": "菜单"
     * - "F": "按钮"
     */
    type MenuType = 'M' | 'C' | 'F';

    type Menu = Common.CommonRecord<{
      /** 菜单 ID */
      menuId?: CommonType.IdType;
      /** 父菜单 ID */
      parentId?: CommonType.IdType;
      /** 菜单名称 */
      menuName?: string;
      /** 显示顺序 */
      orderNum?: number;
      /** 路由地址 */
      path?: string;
      /** 组件路径 */
      component?: string;
      /** 路由参数 */
      queryParam?: string;
      /** 是否为外链（0是 1否） */
      isFrame?: Common.YesOrNoStatus;
      /** 是否缓存（0缓存 1不缓存） */
      isCache?: Common.YesOrNoStatus;
      /** 菜单类型（M目录 C菜单 F按钮） */
      menuType?: MenuType;
      /** 显示状态（0显示 1隐藏） */
      visible?: Common.VisibleStatus;
      /** 菜单状态（0正常 1停用） */
      status?: Common.EnableStatus;
      /** 权限标识 */
      perms?: string;
      /** 菜单图标 */
      icon?: string;
      /** 备注 */
      remark?: string;
      /** 父菜单名称 */
      parentName?: string;
      /** 子菜单 */
      children?: Menu[];
    }>;

    /** menu list */
    type MenuList = Menu[];

    /** menu search params */
    type MenuSearchParams = CommonType.RecordNullable<Pick<Menu, 'menuName' | 'status' | 'menuType' | 'parentId'>>;

    /** menu operate params */
    type MenuOperateParams = Pick<
      Menu,
      | 'menuId'
      | 'menuName'
      | 'parentId'
      | 'orderNum'
      | 'path'
      | 'component'
      | 'queryParam'
      | 'isFrame'
      | 'isCache'
      | 'menuType'
      | 'visible'
      | 'status'
      | 'perms'
      | 'icon'
      | 'remark'
    >;
  }
}
