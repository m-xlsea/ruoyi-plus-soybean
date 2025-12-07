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
      pageSize?: number;
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
}
