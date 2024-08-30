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
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "0": enabled
     * - "1": disabled
     */
    type EnableStatus = '0' | '1';

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
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginData {
      tenantId?: string;
      username?: string;
      password?: string;
      rememberMe?: boolean;
      socialCode?: string;
      socialState?: string;
      source?: string;
      code?: string;
      uuid?: string;
      clientId: string;
      grantType: string;
    }

    type LoginForm = Pick<LoginData, 'tenantId' | 'username' | 'password' | 'rememberMe' | 'code' | 'uuid'>;

    interface LoginToken {
      access_token: string;
      client_id: string;
      expire_in: number;
      openid: string;
      refresh_expire_in: number;
      refresh_token: string;
      scope: string;
    }

    interface UserInfo {
      user?: Api.System.User;
      roles: string[];
      permissions: string[];
    }

    interface Tenant {
      companyName: string;
      domain: string;
      tenantId: string;
    }

    interface TenantList {
      tenantEnabled: boolean;
      voList: Tenant[];
    }

    interface CaptchaCode {
      captchaEnabled: boolean;
      uuid?: string;
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
