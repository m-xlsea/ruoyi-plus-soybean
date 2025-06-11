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
    /** 流程类型 */
    type FlowCodeType = 'leave1' | 'leave2' | 'leave3' | 'leave4' | 'leave5' | 'leave6';
    /** 请假状态 */
    type LeaveType = '1' | '2' | '3' | '4';
    /** leave */
    type Leave = Common.CommonRecord<{
      /** id */
      id: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 请假类型 */
      leaveType: LeaveType;
      /** 开始时间 */
      startDate: string;
      /** 结束时间 */
      endDate: string;
      /** 请假天数 */
      leaveDays: number;
      /** 请假原因 */
      remark: string;
      /** 状态 */
      status: string;
    }>;

    /** leave search params */
    type LeaveSearchParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Leave, 'leaveDays'> & Api.Common.CommonSearchParams
    >;

    /** leave operate params */
    type LeaveOperateParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Leave, 'id' | 'leaveType' | 'startDate' | 'endDate' | 'leaveDays' | 'remark'>
    >;

    /** leave list */
    type LeaveList = Api.Common.PaginatingQueryRecord<Leave>;
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
      /** 流程分类名称 */
      categoryName: string;
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

    /** 节点类型 */
    type WorkflowNodeType = 0 | 1 | 2 | 3 | 4;

    /** 流程激活状态 */
    type WorkflowActivityStatus = 0 | 1;

    /** 流程实例 */
    type ProcessInstance = Common.CommonRecord<{
      /** 主键 */
      id: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 分类ID */
      category: CommonType.IdType;
      /** 分类名称 */
      categoryName: string;
      /** 流程定义ID */
      definitionId: CommonType.IdType;
      /** 流程定义名称 */
      flowName: string;
      /** 流程定义编码 */
      flowCode: string;
      /** 业务ID */
      businessId: CommonType.IdType;
      /** 节点类型 */
      nodeType: WorkflowNodeType;
      /** 节点编码 */
      nodeCode: string;
      /** 节点名称 */
      nodeName: string;
      /** 变量 */
      variable: string;
      /** 流程状态 */
      flowStatus: string;
      /** 流程状态名称 */
      flowStatusName: string;
      /** 流程激活状态 */
      activityStatus: WorkflowActivityStatus;
      /** 审批表单是否自定义 */
      formCustom: Api.Common.YesOrNoStatus;
      /** 审批表单路径 */
      formPath: string;
      /** 扩展字段 */
      ext: string;
      /** 流程定义版本 */
      version: string;
      /** 创建者 */
      createBy: string;
      /** 创建者名称 */
      createByName: string;
      /** 创建时间 */
      createTime: string;

      /** 更新时间 */
      updateTime: string;
      /** 删除标志 */
      delFlag: number;
    }>;

    /** 流程实例搜索参数 */
    type ProcessInstanceSearchParams = CommonType.RecordNullable<
      Pick<ProcessInstance, 'flowName' | 'flowCode' | 'businessId' | 'category' | 'nodeName'> &
        Api.Common.CommonSearchParams & {
          startUserId: CommonType.IdType;
          createByIds: CommonType.IdType[];
        }
    >;
    /** 流程实例列表 */
    type ProcessInstanceList = Common.PaginatingQueryRecord<ProcessInstance>;

    /** 流程作废操作参数 */
    type FlowInvalidOperateParams = CommonType.RecordNullable<{
      /** 主键 */
      id: CommonType.IdType;
      /** 作废原因 */
      comment: string;
    }>;

    /** 启动流程操作参数 */
    type StartWorkflowOperateParams = CommonType.RecordNullable<{
      /** 流程定义ID */
      flowCode: string;
      /** 业务ID */
      businessId: CommonType.IdType;
      /** 变量 */
      variables: { [key: string]: any };
    }>;

    /** 启动流程结果 */
    type StartWorkflowResult = CommonType.RecordNullable<{
      /** 流程实例ID */
      processInstanceId: CommonType.IdType;
      /** 任务ID */
      taskId: CommonType.IdType;
    }>;

    /** 抄送人 */
    type FlowCopy = CommonType.RecordNullable<{
      /** 用户ID */
      userId: CommonType.IdType;
      /** 用户名称 */
      userName: string;
    }>;
    /** 按钮权限 */
    type ButtonPermission = CommonType.RecordNullable<{
      /** 唯一编码 */
      code: CommonType.IdType;
      /** 选项值 */
      value: string;
      /** 是否显示 */
      show: boolean;
    }>;
    /** 任务详情 */
    type Task = Common.CommonRecord<{
      /** 任务ID */
      id: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 删除标志 */
      delFlag: number;
      /** 流程定义ID */
      definitionId: CommonType.IdType;
      /** 流程实例ID */
      instanceId: CommonType.IdType;
      /** 业务ID */
      businessId: CommonType.IdType;
      /** 节点编码 */
      nodeCode: string;
      /** 节点类型 */
      nodeType: WorkflowNodeType;
      /** 权限列表 */
      permissionList: string[];
      /** 用户列表 */
      userList: any[];
      /** 审批表单是否自定义 */
      formCustom: Api.Common.YesOrNoStatus;
      /** 审批表单路径 */
      formPath: string;
      /** 流程状态 */
      flowStatus: string;
      /** 流程状态名称 */
      flowStatusName: string;
      /** 分类ID */
      category: CommonType.IdType;
      /** 分类名称 */
      categoryName: string;
      /** 类型 */
      type: string;
      /** 审批人 */
      assigneeIds: string;
      /** 审批人名称 */
      assigneeNames: string;
      /** 审批人 */
      processedBy: string;
      /** 审批人名称 */
      processedByName: string;
      /** 流程签署比例值 大于0为票签，会签 */
      nodeRatio: string;
      /** 创建人名称 */
      createByName: string;
      /** 是否为申请人节点 */
      applyNode: string;
      /** 按钮列表 */
      buttonList: ButtonPermission[];
      /** 节点名称 */
      nodeName: string;
      /** 流程定义名称 */
      flowName: string;
      /** 流程定义编码 */
      flowCode: string;
      /** 流程版本号 */
      version: string;
    }>;
    /** 消息类型 */
    type MessageType = '1' | '2' | '3';

    /** 完成任务操作参数 */
    type CompleteTaskOperateParams = CommonType.RecordNullable<{
      /** 任务ID */
      taskId: CommonType.IdType;
      /** 文件ID */
      fileId: CommonType.IdType;
      /** 抄送人 */
      flowCopyList: FlowCopy[];
      /** 消息类型 */
      messageType: string[];
      /** 消息 */
      message: string;
      /** 通知 */
      notice: string;
      /** 任务变量 */
      taskVariables: { [key: string]: any };
      /** 变量 */
      variables: { [key: string]: any };
      /** 审批人 */
      assigneeMap: { [key: string]: string };
      /** 扩展字段 */
      ext: string;
    }>;
  }
}
