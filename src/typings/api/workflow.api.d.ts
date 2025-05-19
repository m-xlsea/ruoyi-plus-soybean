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
  }
}
