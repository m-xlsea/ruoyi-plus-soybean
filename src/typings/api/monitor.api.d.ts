/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace Monitor
   *
   * backend api module: "monitor"
   */
  namespace Monitor {
    /** 业务操作类型 */
    type BusinessType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

    /** oper log */
    type OperLog = Common.CommonRecord<{
      /** 日志主键 */
      operId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 系统模块 */
      title: string;
      /** 操作类型 */
      businessType: Monitor.BusinessType;
      /** 方法名称 */
      method: string;
      /** 请求方式 */
      requestMethod: string;
      /** 操作类别 */
      operatorType: string;
      /** 操作人员 */
      operName: string;
      /** 部门名称 */
      deptName: string;
      /** 请求URL */
      operUrl: string;
      /** 操作IP */
      operIp: string;
      /** 操作地点 */
      operLocation: string;
      /** 请求参数 */
      operParam: string;
      /** 返回参数 */
      jsonResult: string;
      /** 操作状态 */
      status: Common.EnableStatus;
      /** 错误消息 */
      errorMsg: string;
      /** 操作时间 */
      operTime: string;
      /** 消耗时间 */
      costTime: number;
    }>;

    /** oper log search params */
    type OperLogSearchParams = CommonType.RecordNullable<
      Pick<Api.Monitor.OperLog, 'title' | 'businessType' | 'operName' | 'operIp' | 'status' | 'operTime'> &
        Api.Common.CommonSearchParams
    >;

    /** oper log list */
    type OperLogList = Api.Common.PaginatingQueryRecord<OperLog>;

    /** login infor */
    type LoginInfor = Common.CommonRecord<{
      /** 访问ID */
      infoId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 用户账号 */
      userName: string;
      /** 客户端 */
      clientKey: string;
      /** 设备类型 */
      deviceType: System.DeviceType;
      /** 登录IP地址 */
      ipaddr: string;
      /** 登录地点 */
      loginLocation: string;
      /** 浏览器类型 */
      browser: string;
      /** 操作系统 */
      os: string;
      /** 登录状态（0成功 1失败） */
      status: Common.EnableStatus;
      /** 提示消息 */
      msg: string;
      /** 访问时间 */
      loginTime: string;
    }>;

    /** login infor search params */
    type LoginInforSearchParams = CommonType.RecordNullable<
      Pick<Api.Monitor.LoginInfor, 'userName' | 'ipaddr' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** login infor list */
    type LoginInforList = Api.Common.PaginatingQueryRecord<LoginInfor>;

    /** cache info */
    type CacheInfo = Common.CommonRecord<{
      /** info */
      info: {
        /** Redis 版本 */
        redis_version: string;
        /** 运行模式 */
        redis_mode: string;
        /** 端口 */
        tcp_port: number;
        /** 客户端数 */
        connected_clients: number;
        /** 运行时间(天) */
        uptime_in_days: number;
        /** 使用内存 */
        used_memory_human: string;
        /** 使用 CPU */
        used_cpu_user_children: string;
        /** 内存配置 */
        maxmemory_human: number;
        /** AOF 是否开启 */
        aof_enabled: string;
        /** RDB 是否成功 */
        rdb_last_bgsave_status: string;
        /** Key 数量 */
        dbSize: number;
        /** 网络入口 */
        instantaneous_input_kbps: number;
        /** 网络出口 */
        instantaneous_output_kbps: number;
      };
      /** db size */
      dbSize: number;
      /** command stats */
      commandStats: {
        name: string;
        value: number;
      }[];
    }>;

    type OnlineUser = Common.CommonRecord<{
      /** 用户账号 */
      userName: string;
      /** 登录IP地址 */
      ipaddr: string;
      /** 登录地点 */
      loginLocation: string;
      /** 浏览器类型 */
      browser: string;
      /** 操作系统 */
      os: string;
      /** 所在部门 */
      deptName: string;
      /** 设备类型 */
      deviceType: System.DeviceType;
      /** 登录时间 */
      loginTime: number;
      /** 令牌ID */
      tokenId: string;
    }>;

    /** online user list */
    type OnlineUserList = Api.Common.PaginatingQueryRecord<OnlineUser>;

    /** online user search params */
    type OnlineUserSearchParams = CommonType.RecordNullable<
      Pick<Api.Monitor.OnlineUser, 'userName' | 'ipaddr'> & Api.Common.CommonSearchParams
    >;
  }
}
