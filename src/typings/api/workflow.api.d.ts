/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace Workflow
   *
   * backend api module: "Workflow"
   */
  namespace Workflow {
    /** 工作流分类 */
    type WorkflowCategory = Common.CommonRecord<{
      /** 主键 */
      categoryId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 分类名称 */
      categoryName: string;
      /** 父级ID */
      parentId: CommonType.IdType;
      /** 祖级列表 */
      ancestors: string;
      /** 排序号 */
      orderNum: number;
      /** 删除标志 */
      delFlag: number;
    }>;

    /** 工作流分类搜索参数 */
    type WorkflowCategorySearchParams = CommonType.RecordNullable<
      Pick<WorkflowCategory, 'categoryName'> & Api.Common.CommonSearchParams
    >;

    /** 工作流分类操作参数 */
    type WorkflowCategoryOperateParams = CommonType.RecordNullable<
      Pick<WorkflowCategory, 'categoryId' | 'categoryName' | 'parentId' | 'orderNum'>
    >;

    /** 工作流分类列表 */
    type WorkflowCategoryList = WorkflowCategory[];

    /** 工作流发布状态 */
    type WorkflowPublishStatus = 0 | 1 | 9;

    /** definition */
    type Definition = Common.CommonTenantRecord<{
      /** 主键id */
      id: CommonType.IdType;
      /** 流程编码 */
      flowCode: string;
      /** 流程名称 */
      flowName: string;
      /** 流程类别 */
      category: string;
      /** 流程版本 */
      version: string;
      /** 是否发布（0未发布 1已发布 9失效） */
      isPublish: WorkflowPublishStatus;
      /** 审批表单是否自定义（Y是 N否） */
      formCustom: string;
      /** 审批表单路径 */
      formPath: string;
      /** 流程激活状态（0挂起 1激活） */
      activityStatus: number;
      /** 监听器类型 */
      listenerType: string;
      /** 监听器路径 */
      listenerPath: string;
      /** 业务详情 存业务表对象json字符串 */
      ext: string;
      /** 删除标志 */
      delFlag: string;
    }>;

    /** definition search params */
    type DefinitionSearchParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Definition, 'flowCode' | 'flowName' | 'category'> & Api.Common.CommonSearchParams
    >;

    /** definition operate params */
    type DefinitionOperateParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Definition, 'id' | 'flowCode' | 'flowName' | 'category' | 'formPath'>
    >;

    /** definition list */
    type DefinitionList = Api.Common.PaginatingQueryRecord<Definition>;
  }
}
