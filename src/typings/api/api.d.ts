/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      pageNum: number;
      /** page size */
      pageSize: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      rows: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'pageNum' | 'pageSize'> &
      CommonType.RecordNullable<{
        orderByColumn: string;
        isAsc: 'asc' | 'desc';
        params: { [key: string]: any };
      }>;

    /**
     * 启用状态
     *
     * - "0": 正常
     * - "1": 停用
     */
    type EnableStatus = '0' | '1';

    /**
     * 显示状态
     *
     * - "0": 显示
     * - "1": 隐藏
     */
    type VisibleStatus = '0' | '1';

    /**
     * 是否状态
     *
     * - "Y": 是
     * - "N": 否
     */
    type YesOrNoStatus = 'Y' | 'N';

    /** common record */
    type CommonRecord<T = any> = {
      /** record creator */
      createBy: string;
      /** record dept */
      createDept?: any;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
    } & T;

    type CommonTenantRecord<T = any> = {
      /** record tenant id */
      tenantId: string;
    } & CommonRecord<T>;

    /** common tree record */
    type CommonTreeRecord = {
      /** record id */
      id: CommonType.IdType;
      /** record parent id */
      parentId: CommonType.IdType;
      /** record label */
      label: string;
      /** record weight */
      weight: number;
      /** record children */
      children: CommonTreeRecord[];
    }[];
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    /** base login form */
    interface LoginForm {
      /** 客户端 ID */
      clientId?: string;
      /** 授权类型 */
      grantType?: string;
      /** 租户ID */
      tenantId?: string;
      /** 验证码 */
      code?: string;
      /** 唯一标识 */
      uuid?: string;
    }

    /** password login form */
    interface PwdLoginForm extends LoginForm {
      /** 用户名 */
      username?: string;
      /** 密码 */
      password?: string;
    }

    /** social login form */
    interface SocialLoginForm extends LoginForm {
      /** 授权码 */
      socialCode?: string;
      /** 授权状态 */
      socialState?: string;
      /** 来源 */
      source?: string;
    }

    /** register form */
    interface RegisterForm extends LoginForm {
      /** 用户名 */
      username?: string;
      /** 密码 */
      password?: string;
      /** 确认密码 */
      confirmPassword?: string;
      /** 用户类型 */
      userType?: string;
    }

    /** login token data */
    interface LoginToken {
      /** 授权令牌 */
      access_token?: string;
      /** 应用id */
      client_id?: string;
      /** 授权令牌 access_token 的有效期 */
      expire_in?: number;
      /** 用户 openid */
      openid?: string;
      /** 刷新令牌 refresh_token 的有效期 */
      refresh_expire_in?: number;
      /** 刷新令牌 */
      refresh_token?: string;
      /** 令牌权限 */
      scope?: string;
    }

    /** userinfo */
    interface UserInfo {
      /** 用户信息 */
      user?: Api.System.User & {
        /** 所属角色 */
        roles: Api.System.Role[];
      };
      /** 角色列表 */
      roles: string[];
      /** 菜单权限 */
      permissions: string[];
    }

    /** tenant */
    interface Tenant {
      /** 企业名称 */
      companyName: string;
      /** 域名 */
      domain: string;
      /** 租户编号 */
      tenantId: string;
    }

    /** login tenant */
    interface LoginTenant {
      /** 租户开关 */
      tenantEnabled: boolean;
      /** 租户列表 */
      voList: Tenant[];
    }

    interface CaptchaCode {
      /** 是否开启验证码 */
      captchaEnabled: boolean;
      /** 唯一标识 */
      uuid?: string;
      /** 验证码图片 */
      img?: string;
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
}
