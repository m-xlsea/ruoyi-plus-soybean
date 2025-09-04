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
    /** 业务流程状态 */
    type BusinessStatus = 'cancel' | 'draft' | 'waiting' | 'finish' | 'invalid' | 'back' | 'termination';

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
      status: BusinessStatus;
    }>;

    /** leave search params */
    type LeaveSearchParams = CommonType.RecordNullable<
      { startLeaveDays: number; endLeaveDays: number } & Api.Common.CommonSearchParams
    >;

    /** leave operate params */
    type LeaveOperateParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Leave, 'id' | 'leaveType' | 'startDate' | 'endDate' | 'leaveDays' | 'remark'>
    >;

    /** leave detail */
    type LeaveDetail = CommonType.RecordNullable<
      Pick<Api.Workflow.Leave, 'id' | 'leaveType' | 'startDate' | 'endDate' | 'leaveDays' | 'remark' | 'status'>
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

    /** spel */
    type Spel = Common.CommonRecord<{
      /** 主键id */
      id: CommonType.IdType;
      /** 组件名称 */
      componentName: string;
      /** 方法名 */
      methodName: string;
      /** 参数 */
      methodParams: string;
      /** spel表达式 */
      viewSpel: string;
      /** 备注 */
      remark: string;
      /** 状态 */
      status: string;
      /** 删除标志 */
      delFlag: string;
    }>;

    /** spel search params */
    type SpelSearchParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Spel, 'componentName' | 'methodName' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** spel operate params */
    type SpelOperateParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Spel, 'id' | 'componentName' | 'methodName' | 'methodParams' | 'viewSpel' | 'remark' | 'status'>
    >;

    /** spel list */
    type SpelList = Api.Common.PaginatingQueryRecord<Spel>;

    /** 工作流发布状态 */
    type WorkflowPublishStatus = 0 | 1 | 9;

    /** 设计器模式 */
    type DefinitionDesignerMode = 'CLASSICS' | 'MIMIC';

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
      formCustom: Api.Common.YesOrNoStatus;
      /** 审批表单路径 */
      formPath: string;
      /** 流程激活状态（0挂起 1激活） */
      activityStatus: WorkflowActivityStatus;
      /** 监听器类型 */
      listenerType: string;
      /** 监听器路径 */
      listenerPath: string;
      /** 业务详情 存业务表对象json字符串 */
      ext: string;
      /** 设计器模式 */
      modelValue: DefinitionDesignerMode;
      /** 删除标志 */
      delFlag: string;
    }>;

    /** definition search params */
    type DefinitionSearchParams = CommonType.RecordNullable<
      Pick<Api.Workflow.Definition, 'flowCode' | 'flowName' | 'category'> & Api.Common.CommonSearchParams
    >;

    /** definition operate params */
    type DefinitionOperateParams = CommonType.RecordNullable<
      Pick<
        Api.Workflow.Definition,
        'id' | 'flowCode' | 'flowName' | 'category' | 'formPath' | 'formCustom' | 'modelValue' | 'ext'
      >
    >;

    /** definition list */
    type DefinitionList = Api.Common.PaginatingQueryRecord<Definition>;

    type InstanceVariable = CommonType.RecordNullable<{
      key: string;
      value: string;
    }>;

    type InstanceVariableOperateParams = CommonType.RecordNullable<{
      instanceId: CommonType.IdType;
    }> &
      InstanceVariable;

    type InstanceVariableInfo = CommonType.RecordNullable<{
      /** 键 */
      variable: string;
      /** 值 */
      variableList: InstanceVariable[];
    }>;

    /** 节点类型 */
    type WorkflowNodeType = 0 | 1 | 2 | 3 | 4;

    /** 流程激活状态 */
    type WorkflowActivityStatus = 0 | 1;

    /** 流程实例 */
    type Instance = Common.CommonRecord<{
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
      /** 业务编码 */
      businessCode: string;
      /** 业务名称 */
      businessName: string;
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
      /** 创建者名称 */
      createByName: string;
      /** 删除标志 */
      delFlag: number;
    }>;

    /** 流程实例搜索参数 */
    type InstanceSearchParams = CommonType.RecordNullable<
      Pick<Instance, 'flowName' | 'flowCode' | 'businessId' | 'category' | 'nodeName'> &
        Api.Common.CommonSearchParams & {
          startUserId: CommonType.IdType;
          createByIds: CommonType.IdType[];
        }
    >;
    /** 流程实例列表 */
    type InstanceList = Common.PaginatingQueryRecord<Instance>;

    /** 流程作废操作参数 */
    type FlowInvalidOperateParams = CommonType.RecordNullable<{
      /** 主键 */
      id: CommonType.IdType;
      /** 作废原因 */
      comment: string;
    }>;

    /** 流程撤销操作参数 */
    type CancelProcessApplyParams = CommonType.RecordNullable<{
      /** 主键 */
      businessId: CommonType.IdType;
      /** 撤销原因 */
      message: string;
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
      instanceId: CommonType.IdType;
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

    type TaskOrHisTask = Task | HisTask;

    /** 任务详情 */
    type Task = Common.CommonTenantRecord<{
      /** 任务ID */
      id: CommonType.IdType;
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
      /** 办理人类型 */
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

    /** 任务列表 */
    type TaskList = Common.PaginatingQueryRecord<Task>;

    /** 任务操作类型 */
    type TaskOperateType = 'delegateTask' | 'transferTask' | 'addSignature' | 'reductionSignature' | 'stopTask';

    /** 任务操作参数 */
    type TaskOperateParams = CommonType.RecordNullable<{
      taskId: CommonType.IdType;
      userId?: CommonType.IdType;
      userIds?: CommonType.IdType[];
      message?: string;
    }>;

    /** 终止任务 */
    type TerminateTaskOperateParams = CommonType.RecordNullable<{
      taskId: CommonType.IdType;
      comment?: string;
    }>;

    /** 协作方式 */
    type CooperateType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

    /** 历史任务 */
    type HisTask = Common.CommonTenantRecord<{
      /** 任务ID */
      id: CommonType.IdType;
      /** 删除标志 */
      delFlag: number;
      /** 流程定义ID */
      definitionId: CommonType.IdType;
      /** 流程定义名称 */
      flowName: string;
      /** 流程实例ID */
      instanceId: CommonType.IdType;
      /** 任务表ID */
      taskId: CommonType.IdType;
      /** 协作方式（1审批 2转办 3委派 4会签 5票签 6加签 7减签） */
      cooperateType: CooperateType;
      /** 协作方式名称 */
      cooperateTypeName: string;
      /** 业务ID */
      businessId: string;
      /** 节点编码 */
      nodeCode: string;
      /** 节点名称 */
      nodeName: string;
      /** 节点类型（0开始节点 1中间节点 2结束节点 3互斥网关 4并行网关） */
      nodeType: WorkflowNodeType;
      /** 目标节点编码 */
      targetNodeCode: string;
      /** 目标节点名称 */
      targetNodeName: string;
      /** 审批者 */
      approver: string;
      /** 审批者名称 */
      approveName: string;
      /** 协作人 */
      collaborator: string;
      /** 权限标识 */
      permissionList: string[];
      /** 跳转类型（PASS通过 REJECT退回 NONE无动作） */
      skipType: string;
      /** 流程状态 */
      flowStatus: string;
      /** 任务状态 */
      flowTaskStatus: string;
      /** 流程状态名称 */
      flowStatusName: string;
      /** 审批意见 */
      message: string;
      /** 业务扩展信息（JSON字符串） */
      ext: string;
      /** 创建者姓名（申请人名称） */
      createByName: string;
      /** 流程分类ID */
      category: string;
      /** 流程分类名称 */
      categoryName: string;
      /** 审批表单是否自定义（Y是 N否） */
      formCustom: Api.Common.YesOrNoStatus;
      /** 表单路径 */
      formPath: string;
      /** 流程定义编码 */
      flowCode: string;
      /** 流程版本号 */
      version: string;
      /** 运行时长 */
      runDuration: string;
      /** 附件 */
      attachmentList: Api.System.Oss[];
    }>;

    /** 历史任务列表 */
    type HisTaskList = Common.PaginatingQueryRecord<HisTask>;

    /** 流程实例ID与历史任务 */
    type InstanceIdWithHisTask = Common.CommonRecord<{
      /** 流程实例ID */
      instanceId: CommonType.IdType;
      /** 历史任务 */
      list: HisTask[];
    }>;

    /** 任务搜索参数 */
    type TaskSearchParams = CommonType.RecordNullable<
      Pick<Task, 'flowName' | 'flowCode' | 'businessId' | 'category' | 'nodeName' | 'instanceId' | 'permissionList'> &
        Api.Common.CommonSearchParams & {
          createByIds: CommonType.IdType[];
        }
    >;
    type TaskNextNodeSearchParams = CommonType.RecordNullable<{
      taskId: CommonType.IdType;
      taskVariables: { [key: string]: any };
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

    /** 工作流节点 */
    type FlowNode = Common.CommonTenantRecord<{
      /** 节点ID */
      id: CommonType.IdType;
      /** 删除标志 */
      delFlag: string;
      /** 节点类型（0开始节点 1中间节点 2结束节点 3互斥网关 4并行网关） */
      nodeType: WorkflowNodeType;
      /** 流程定义ID */
      definitionId: CommonType.IdType;
      /** 节点编码 */
      nodeCode: string;
      /** 节点名称 */
      nodeName: string;
      /** 权限标识 */
      permissionFlag: string;
      /** 流程签署比例值 */
      nodeRatio: string;
      /** 节点坐标 */
      coordinate: string;
      /** 流程版本号 */
      version: string;
      /** 是否允许任意节点跳转 */
      anyNodeSkip: string;
      /** 监听器类型 */
      listenerType: string;
      /** 监听器路径 */
      listenerPath: string;
      /** 处理器类型 */
      handlerType: string;
      /** 处理器路径 */
      handlerPath: string;
      /** 审批表单是否自定义（Y是 N否） */
      formCustom: Api.Common.YesOrNoStatus;
      /** 审批表单路径 */
      formPath: string;
      /** 扩展字段 */
      ext: string;
    }>;

    /** 工作流节点列表 */
    type FlowNodeList = FlowNode[];

    /** 驳回操作参数 */
    type BackOperateParams = CommonType.RecordNullable<{
      taskId: CommonType.IdType;
      fileId: CommonType.IdType;
      messageType: string[];
      nodeCode: string;
      message: string;
      notice: string;
      variables: { [key: string]: any };
    }>;
  }
}
