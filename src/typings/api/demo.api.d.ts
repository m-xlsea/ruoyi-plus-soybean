/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace Demo
   *
   * backend api module: "Demo"
   */
  namespace Demo {
    /** demo */
    type Demo = Common.CommonRecord<{
      /** 主键 */
      id: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 部门id */
      deptId: CommonType.IdType;
      /** 用户id */
      userId: CommonType.IdType;
      /** 排序号 */
      orderNum: number;
      /** key键 */
      testKey: string;
      /** 值 */
      value: string;
      /** 备注 */
      remark: string;
      /** 版本 */
      version: number;
      /** 删除标志 */
      delFlag: number;
    }>;

    /** demo search params */
    type DemoSearchParams = CommonType.RecordNullable<
      Pick<Api.Demo.Demo, 'deptId' | 'userId' | 'testKey' | 'value'> & Api.Common.CommonSearchParams
    >;

    /** demo operate params */
    type DemoOperateParams = CommonType.RecordNullable<
      Pick<Api.Demo.Demo, 'id' | 'deptId' | 'userId' | 'orderNum' | 'testKey' | 'value' | 'remark'>
    >;

    /** demo list */
    type DemoList = Api.Common.PaginatingQueryRecord<Demo>;

    /** tree */
    type Tree = Common.CommonRecord<{
      /** 主键 */
      id: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 父id */
      parentId: CommonType.IdType;
      /** 部门id */
      deptId: CommonType.IdType;
      /** 用户id */
      userId: CommonType.IdType;
      /** 值 */
      treeName: string;
      /** 版本 */
      version: number;
      /** 删除标志 */
      delFlag: number;
    }>;

    /** tree search params */
    type TreeSearchParams = CommonType.RecordNullable<
      Pick<Api.Demo.Tree, 'parentId' | 'deptId' | 'userId' | 'treeName'> & Api.Common.CommonSearchParams
    >;

    /** tree operate params */
    type TreeOperateParams = CommonType.RecordNullable<
      Pick<Api.Demo.Tree, 'id' | 'parentId' | 'deptId' | 'userId' | 'treeName'>
    >;

    /** tree list */
    type TreeList = Tree[];
  }
}
