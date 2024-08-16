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
      roleId: string | number;
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
      menuIds?: Array<string | number>;
      deptIds?: Array<string | number>;
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
    type User = Common.CommonRecord<{
      userId: string | number;
      deptId: number;
      userName: string;
      nickName: string;
      userType: string;
      email: string;
      phonenumber: string;
      sex: string;
      avatar: string;
      status: string;
      delFlag: string;
      loginIp: string;
      loginDate: string;
      remark: string;
      deptName: string;
      roles: Role[];
      roleIds: any;
      postIds: any;
      roleId: any;
      admin: boolean;
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<User, 'userName' | 'sex' | 'nickName' | 'phonenumber' | 'email' | 'status'> & CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "M": "目录"
     * - "C": "菜单"
     * - "F": "按钮"
     */
    type MenuType = 'M' | 'C' | 'F';

    type Menu = Common.CommonRecord<
      {
        parentName: string;
        parentId: string | number;
        children: Menu[];
        menuId: string | number;
        menuName: string;
        orderNum: number;
        path: string;
        component: string;
        queryParam: string;
        isFrame: string;
        isCache: string;
        menuType: MenuType;
        visible: string;
        status: Common.EnableStatus;
        perms: string;
        icon: string;
        componentInfo: string;
        remark: string;
        keywords?: string;
      } & Pick<import('vue-router').RouteMeta, 'i18nKey'>
    >;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuSearchParams = CommonType.RecordNullable<Pick<Api.System.Menu, 'menuName' | 'status' | 'keywords'>> &
      CommonSearchParams;
  }
}
