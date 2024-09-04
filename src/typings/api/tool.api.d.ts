/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace Tool
   *
   * backend api module: "tool"
   */
  namespace Tool {
    /** 代码生成业务表 */
    export type GenTable = {
      /** 生成业务名 */
      businessName: string;
      /** 实体类名称(首字母大写) */
      className: string;
      /** 表列信息 */
      columns?: GenTableColumn[];
      /** 是否单表（增删改查） */
      crud?: boolean;
      /** 数据源名称 */
      dataName: string;
      /** 生成作者 */
      functionAuthor: string;
      /** 生成功能名 */
      functionName: string;
      /** 生成路径（不填默认项目路径） */
      genPath?: string;
      /** 生成代码方式（0zip压缩包 1自定义路径） */
      genType?: string;
      /** 菜单 id 列表 */
      menuIds?: CommonType.IdType[];
      /** 生成模块名 */
      moduleName: string;
      /** 其它生成选项 */
      options?: string;
      /** 生成包路径 */
      packageName: string;
      /** 上级菜单ID字段 */
      parentMenuId?: string;
      /** 上级菜单名称字段 */
      parentMenuName?: string;
      /** 主键信息 */
      pkColumn?: GenTableColumn;
      /** 备注 */
      remark?: string;
      /** 本表关联父表的外键名 */
      subTableFkName?: string;
      /** 关联父表的表名 */
      subTableName?: string;
      /** 表描述 */
      tableComment: string;
      /** 编号 */
      tableId?: number;
      /** 表名称 */
      tableName: string;
      /** 使用的模板（crud单表操作 tree树表操作 sub主子表操作） */
      tplCategory?: string;
      /** 是否tree树表操作 */
      tree?: boolean;
      /** 树编码字段 */
      treeCode?: string;
      /** 树名称字段 */
      treeName?: string;
      /** 树父编码字段 */
      treeParentCode?: string;
    };

    /** 代码生成业务字段 */
    export type GenTableColumn = {
      /** 列描述 */
      columnComment?: string;
      /** 编号 */
      columnId?: number;
      /** 列名称 */
      columnName?: string;
      /** 列类型 */
      columnType?: string;
      /** 字典类型 */
      dictType?: string;
      /** 是否编辑字段（1是） */
      edit?: boolean;
      /** 显示类型（input文本框、textarea文本域、select下拉框、checkbox复选框、radio单选框、datetime日期控件、image图片上传控件、upload文件上传控件、editor富文本控件） */
      htmlType?: string;
      /** 是否自增（1是） */
      increment?: boolean;
      /** 是否为插入字段（1是） */
      insert?: boolean;
      /** 是否编辑字段（1是） */
      isEdit?: string;
      /** 是否自增（1是） */
      isIncrement?: string;
      /** 是否为插入字段（1是） */
      isInsert?: string;
      /** 是否列表字段（1是） */
      isList?: string;
      /** 是否主键（1是） */
      isPk?: string;
      /** 是否查询字段（1是） */
      isQuery?: string;
      /** 是否必填（1是） */
      isRequired?: string;
      /** JAVA字段名 */
      javaField: string;
      /** JAVA类型 */
      javaType?: string;
      /** 是否列表字段（1是） */
      list?: boolean;
      /** 是否主键（1是） */
      pk?: boolean;
      /** 是否查询字段（1是） */
      query?: boolean;
      /** 查询方式（EQ等于、NE不等于、GT大于、LT小于、LIKE模糊、BETWEEN范围） */
      queryType?: string;
      /** 是否必填（1是） */
      required?: boolean;
      /** 排序 */
      sort?: number;
      /** 是否基类字段 */
      superColumn?: boolean;
      /** 归属表编号 */
      tableId?: number;
      /** 可用字段 */
      usableColumn?: boolean;
    };

    /** gen table search params */
    type GenTableSearchParams = CommonType.RecordNullable<
      Pick<GenTable, 'dataName' | 'tableName' | 'tableComment'> &
        CommonType.RecordNullable<
          Common.CommonSearchParams & {
            params: {
              beginTime: string;
              endTime: string;
            };
          }
        >
    >;

    /** gen table list */
    type GenTableList = Common.PaginatingQueryRecord<GenTable>;
  }
}
