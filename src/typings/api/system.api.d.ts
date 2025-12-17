/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * namespace System
   *
   * backend api module: "system"
   */
  namespace System {
    /** data scope */
    type DataScope = '1' | '2' | '3' | '4' | '5' | '6';

    /** role */
    type Role = Common.CommonRecord<{
      /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
      dataScope: DataScope;
      /** 部门树选择项是否关联显示 */
      deptCheckStrictly: boolean;
      /** 用户是否存在此角色标识 默认不存在 */
      flag: boolean;
      /** 菜单树选择项是否关联显示 */
      menuCheckStrictly: boolean;
      /** 备注 */
      remark?: string;
      /** 角色ID */
      roleId: CommonType.IdType;
      /** 角色权限字符串 */
      roleKey: string;
      /** 角色名称 */
      roleName: string;
      /** 显示顺序 */
      roleSort: number;
      /** 角色状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 是否管理员 */
      superAdmin: boolean;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Role, 'roleName' | 'roleKey' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** role operate params */
    type RoleOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.Role,
        | 'roleId'
        | 'roleName'
        | 'roleKey'
        | 'roleSort'
        | 'menuCheckStrictly'
        | 'deptCheckStrictly'
        | 'dataScope'
        | 'status'
        | 'remark'
      > & { menuIds: CommonType.IdType[]; deptIds: CommonType.IdType[] }
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** role menu tree select */
    type RoleMenuTreeSelect = Common.CommonRecord<{
      checkedKeys: CommonType.IdType[];
      menus: MenuList;
    }>;
    /** teannt-package menu tree select */
    type TenantPackageMenuTreeSelect = Common.CommonRecord<{
      checkedKeys: CommonType.IdType[];
      menus: MenuList;
    }>;
    /** role dept tree select */
    type RoleDeptTreeSelect = Common.CommonRecord<{
      checkedKeys: CommonType.IdType[];
      depts: Dept[];
    }>;

    /** all role */
    type AllRole = Pick<Role, 'roleId' | 'roleName' | 'roleKey'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonTenantRecord<{
      /** 用户ID */
      userId: CommonType.IdType;
      /** 部门ID */
      deptId: CommonType.IdType;
      /** 部门名称 */
      deptName: string;
      /** 用户账号 */
      userName: string;
      /** 用户昵称 */
      nickName: string;
      /** 用户类型（sys_user系统用户） */
      userType: string;
      /** 用户邮箱 */
      email: string;
      /** 手机号码 */
      phonenumber: string;
      /** 用户性别（0男 1女 2未知） */
      sex: string;
      /** 头像地址 */
      avatar: string;
      /** 密码 */
      password: string;
      /** 帐号状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 最后登录IP */
      loginIp: string;
      /** 最后登录时间 */
      loginDate: Date;
      /** 备注 */
      remark?: string;
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<User, 'deptId' | 'userName' | 'nickName' | 'phonenumber' | 'status'> & {
        roleId: CommonType.IdType;
      } & Common.CommonSearchParams
    >;

    /** user operate params */
    type UserOperateParams = CommonType.RecordNullable<
      Pick<
        User,
        | 'userId'
        | 'deptId'
        | 'userName'
        | 'nickName'
        | 'email'
        | 'phonenumber'
        | 'sex'
        | 'password'
        | 'status'
        | 'remark'
      > & { roleIds: CommonType.IdType[]; postIds: CommonType.IdType[] }
    >;

    /** user profile operate params */
    type UserProfileOperateParams = CommonType.RecordNullable<Pick<User, 'nickName' | 'email' | 'phonenumber' | 'sex'>>;

    /** user password operate params */
    type UserPasswordOperateParams = CommonType.RecordNullable<{
      oldPassword: string;
      newPassword: string;
    }>;

    /** user info */
    type UserInfo = {
      /** user post ids */
      postIds: string[];
      /** user role ids */
      roleIds: string[];
      /** roles */
      roles: Role[];
    };

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /** auth role */
    type AuthRole = {
      user: User;
      roles: Role[];
    };

    /** social */
    type Social = Common.CommonRecord<{
      /** 主键 */
      id: CommonType.IdType;
      /** 用户ID */
      userId: CommonType.IdType;
      /** 租户ID */
      tenantId: CommonType.IdType;
      /** 认证的唯一ID */
      authId: string;
      /** 用户来源 */
      source: string;
      /** 用户的授权令牌 */
      accessToken: string;
      /** 用户的授权令牌的有效期，部分平台可能没有 */
      expireIn: number;
      /** 刷新令牌，部分平台可能没有 */
      refreshToken: string;
      /** 用户的 open id */
      openId: string;
      /** 授权的第三方账号 */
      userName: string;
      /** 授权的第三方昵称 */
      nickName: string;
      /** 授权的第三方邮箱 */
      email: string;
      /** 授权的第三方头像地址 */
      avatar: string;
      /** 平台的授权信息，部分平台可能没有 */
      accessCode: string;
      /** 用户的 unionid */
      unionId: string;
      /** 授予的权限，部分平台可能没有 */
      scope: string;
      /** 个别平台的授权信息，部分平台可能没有 */
      tokenType: string;
      /** id token，部分平台可能没有 */
      idToken: string;
      /** 小米平台用户的附带属性，部分平台可能没有 */
      macAlgorithm: string;
      /** 小米平台用户的附带属性，部分平台可能没有 */
      macKey: string;
      /** 用户的授权code，部分平台可能没有 */
      code: string;
      /** Twitter平台用户的附带属性，部分平台可能没有 */
      oauthToken: string;
      /** Twitter平台用户的附带属性，部分平台可能没有 */
      oauthTokenSecret: string;
    }>;

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    /**
     * menu layout
     *
     * - "0": "默认布局"
     * - "1": "空白布局"
     */
    type MenuLayout = '0' | '1';

    /**
     * menu type
     *
     * - "M": "目录"
     * - "C": "菜单"
     * - "F": "按钮"
     */
    type MenuType = 'M' | 'C' | 'F';

    /**
     * 是否外链
     *
     * - "0": "是"
     * - "1": "否"
     * - "2": "iframe"
     */
    type IsMenuFrame = '0' | '1' | '2';

    type Menu = Common.CommonRecord<{
      /** 菜单 ID */
      menuId: CommonType.IdType;
      /** 父菜单 ID */
      parentId: CommonType.IdType;
      /** 菜单名称 */
      menuName: string;
      /** 显示顺序 */
      orderNum: number;
      /** 路由地址 */
      path: string;
      /** 组件路径 */
      component: string;
      /** 路由参数 */
      queryParam: string;
      /** 是否为外链（0是 1否 2iframe） */
      isFrame: IsMenuFrame;
      /** 是否缓存（0缓存 1不缓存） */
      isCache: Common.EnableStatus;
      /** 菜单类型（M目录 C菜单 F按钮） */
      menuType: MenuType;
      /** 显示状态（0显示 1隐藏） */
      visible: Common.VisibleStatus;
      /** 菜单状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 权限标识 */
      perms: string;
      /** 菜单图标 */
      icon: string;
      /** 备注 */
      remark?: string;
      /** 父菜单名称 */
      parentName: string;
      /** 子菜单 */
      children: MenuList;
      id?: CommonType.IdType;
      label?: string;
    }>;

    /** menu list */
    type MenuList = Menu[];

    /** menu search params */
    type MenuSearchParams = CommonType.RecordNullable<Pick<Menu, 'menuName' | 'status' | 'menuType' | 'parentId'>>;

    /** menu operate params */
    type MenuOperateParams = CommonType.RecordNullable<
      Pick<
        Menu,
        | 'menuId'
        | 'menuName'
        | 'parentId'
        | 'orderNum'
        | 'path'
        | 'component'
        | 'queryParam'
        | 'isFrame'
        | 'isCache'
        | 'menuType'
        | 'visible'
        | 'status'
        | 'perms'
        | 'icon'
        | 'remark'
      >
    >;

    /** 字典类型 */
    type DictType = Common.CommonRecord<{
      /** 字典主键 */
      dictId: CommonType.IdType;
      /** 字典名称 */
      dictName: string;
      /** 字典类型 */
      dictType: string;
      /** 备注 */
      remark: string;
    }>;

    /** dict type search params */
    type DictTypeSearchParams = CommonType.RecordNullable<
      Pick<Api.System.DictType, 'dictName' | 'dictType'> & Api.Common.CommonSearchParams
    >;

    /** dict type operate params */
    type DictTypeOperateParams = CommonType.RecordNullable<
      Pick<Api.System.DictType, 'dictId' | 'dictName' | 'dictType' | 'remark'>
    >;

    /** dict type list */
    type DictTypeList = Api.Common.PaginatingQueryRecord<DictType>;

    /** 字典数据 */
    type DictData = Common.CommonRecord<{
      /** 样式属性（其他样式扩展） */
      cssClass: string;
      /** 字典编码 */
      dictCode: CommonType.IdType;
      /** 字典标签 */
      dictLabel: string;
      /** 字典排序 */
      dictSort: number;
      /** 字典类型 */
      dictType: string;
      /** 字典键值 */
      dictValue: string;
      /** 是否默认（Y是 N否） */
      isDefault: Common.YesOrNoStatus;
      /** 表格回显样式 */
      listClass: NaiveUI.ThemeColor;
      /** 备注 */
      remark: string;
    }>;

    /** dict data search params */
    type DictDataSearchParams = CommonType.RecordNullable<
      Pick<Api.System.DictData, 'dictLabel' | 'dictType'> & Api.Common.CommonSearchParams
    >;

    /** dict data operate params */
    type DictDataOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.DictData,
        | 'dictCode'
        | 'dictSort'
        | 'dictLabel'
        | 'dictValue'
        | 'dictType'
        | 'cssClass'
        | 'listClass'
        | 'isDefault'
        | 'remark'
      >
    >;

    /** dict data list */
    type DictDataList = Api.Common.PaginatingQueryRecord<DictData>;

    /** dept */
    type Dept = Api.Common.CommonRecord<{
      /** 部门id */
      deptId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 父部门id */
      parentId: CommonType.IdType;
      /** 祖级列表 */
      ancestors: string;
      /** 部门名称 */
      deptName: string;
      /** 部门类别编码 */
      deptCategory: string;
      /** 显示顺序 */
      orderNum: number;
      /** 负责人 */
      leader: number;
      /** 联系电话 */
      phone: string;
      /** 邮箱 */
      email: string;
      /** 部门状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 子部门 */
      children: Dept[];
    }>;

    /** dept search params */
    type DeptSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Dept, 'deptName' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** dept operate params */
    type DeptOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.Dept,
        'deptId' | 'parentId' | 'deptName' | 'deptCategory' | 'orderNum' | 'leader' | 'phone' | 'email' | 'status'
      >
    >;

    /** dept list */
    type DeptList = Api.Common.PaginatingQueryRecord<Dept>;

    /** post */
    type Post = Common.CommonRecord<{
      /** 岗位ID */
      postId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 部门id */
      deptId: CommonType.IdType;
      /** 岗位编码 */
      postCode: string;
      /** 类别编码 */
      postCategory: string;
      /** 岗位名称 */
      postName: string;
      /** 显示顺序 */
      postSort: number;
      /** 状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 备注 */
      remark: string;
    }>;

    /** post search params */
    type PostSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Post, 'deptId' | 'postCode' | 'postName' | 'status'> & {
        belongDeptId: CommonType.IdType;
      } & Api.Common.CommonSearchParams
    >;

    /** post operate params */
    type PostOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.Post,
        'postId' | 'deptId' | 'postCode' | 'postCategory' | 'postName' | 'postSort' | 'status' | 'remark'
      >
    >;

    /** post list */
    type PostList = Api.Common.PaginatingQueryRecord<Post>;

    /** config */
    type Config = Common.CommonRecord<{
      /** 参数主键 */
      configId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 参数名称 */
      configName: string;
      /** 参数键名 */
      configKey: string;
      /** 参数键值 */
      configValue: string;
      /** 是否内置 */
      configType: Common.YesOrNoStatus;
      /** 备注 */
      remark: string;
    }>;

    /** config search params */
    type ConfigSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Config, 'configName' | 'configKey' | 'configType' | 'createTime'> & Api.Common.CommonSearchParams
    >;

    /** config operate params */
    type ConfigOperateParams = CommonType.RecordNullable<
      Pick<Api.System.Config, 'configId' | 'configName' | 'configKey' | 'configValue' | 'configType' | 'remark'>
    >;

    /** config list */
    type ConfigList = Api.Common.PaginatingQueryRecord<Config>;

    /** tenant */
    type Tenant = Common.CommonRecord<{
      /** id */
      id: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 联系人 */
      contactUserName: string;
      /** 联系电话 */
      contactPhone: string;
      /** 企业名称 */
      companyName: string;
      /** 统一社会信用代码 */
      licenseNumber: string;
      /** 地址 */
      address: string;
      /** 企业简介 */
      intro: string;
      /** 域名 */
      domain: string;
      /** 备注 */
      remark: string;
      /** 租户套餐编号 */
      packageId: CommonType.IdType;
      /** 过期时间 */
      expireTime: string;
      /** 用户数量（-1不限制） */
      accountCount: number;
      /** 租户状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 删除标志（0代表存在 1代表删除） */
      delFlag: string;
    }>;

    /** tenant search params */
    type TenantSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Tenant, 'tenantId' | 'contactUserName' | 'contactPhone' | 'companyName'> &
        Api.Common.CommonSearchParams
    >;

    /** tenant operate params */
    type TenantOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.Tenant,
        | 'id'
        | 'tenantId'
        | 'contactUserName'
        | 'contactPhone'
        | 'companyName'
        | 'licenseNumber'
        | 'address'
        | 'intro'
        | 'domain'
        | 'remark'
        | 'packageId'
        | 'expireTime'
        | 'accountCount'
        | 'status'
      > & {
        username: string;
        password: string;
      }
    >;

    /** tenant package sync params */
    type TenantPackageSyncParams = CommonType.RecordNullable<Pick<Api.System.Tenant, 'tenantId' | 'packageId'>>;

    /** tenant list */
    type TenantList = Api.Common.PaginatingQueryRecord<Tenant>;

    /** tenant package */
    type TenantPackage = Common.CommonRecord<{
      /** 租户套餐id */
      packageId: CommonType.IdType;
      /** 套餐名称 */
      packageName: string;
      /** 关联菜单id */
      menuIds: CommonType.IdType[];
      /** 备注 */
      remark: string;
      /** 菜单树选择项是否关联显示 */
      menuCheckStrictly: boolean;
      /** 状态（0正常 1停用） */
      status: Common.EnableStatus;
      /** 删除标志（0代表存在 1代表删除） */
      delFlag: string;
    }>;

    /** tenant package search params */
    type TenantPackageSearchParams = CommonType.RecordNullable<
      Pick<Api.System.TenantPackage, 'packageName' | 'menuIds' | 'menuCheckStrictly' | 'status'> &
        Api.Common.CommonSearchParams
    >;

    /** tenant package operate params */
    type TenantPackageOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.TenantPackage,
        'packageId' | 'packageName' | 'menuIds' | 'remark' | 'menuCheckStrictly' | 'status'
      >
    >;

    /** tenant package list */
    type TenantPackageList = Api.Common.PaginatingQueryRecord<TenantPackage>;

    /** tenant package select list */
    type TenantPackageSelectList = Common.CommonRecord<Pick<TenantPackage, 'packageId' | 'packageName'>>;

    /** 通知公告类型 */
    type NoticeType = '1' | '2';

    /** notice */
    type Notice = Common.CommonRecord<{
      /** 公告ID */
      noticeId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 公告标题 */
      noticeTitle: string;
      /** 公告类型 */
      noticeType: System.NoticeType;
      /** 公告内容 */
      noticeContent: string;
      /** 公告状态 */
      status: Common.EnableStatus;
      /** 创建者 */
      createByName: string;
      /** 备注 */
      remark: string;
    }>;

    /** notice search params */
    type NoticeSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Notice, 'noticeTitle' | 'noticeType'> & Api.Common.CommonSearchParams
    >;

    /** notice operate params */
    type NoticeOperateParams = CommonType.RecordNullable<
      Pick<Api.System.Notice, 'noticeId' | 'noticeTitle' | 'noticeType' | 'noticeContent' | 'status'>
    >;

    /** notice list */
    type NoticeList = Api.Common.PaginatingQueryRecord<Notice>;

    /** 授权类型 */
    type GrantType = 'password' | 'sms' | 'password' | 'email' | 'xcx' | 'social';

    /** 设备类型 */
    type DeviceType = 'pc' | 'android' | 'ios' | 'xcx';

    /** client */
    type Client = Common.CommonRecord<{
      /** id */
      id: CommonType.IdType;
      /** 客户端id */
      clientId: string;
      /** 客户端key */
      clientKey: string;
      /** 客户端秘钥 */
      clientSecret: string;
      /** 授权类型 */
      grantType: System.GrantType;
      /** 授权类型列表 */
      grantTypeList: System.GrantType[];
      /** 设备类型 */
      deviceType: System.DeviceType;
      /** token活跃超时时间 */
      activeTimeout: number;
      /** token固定超时 */
      timeout: number;
      /** 状态 */
      status: Common.EnableStatus;
      /** 删除标志（0代表存在 1代表删除） */
      delFlag: string;
    }>;

    /** client search params */
    type ClientSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Client, 'clientKey' | 'clientSecret' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** client operate params */
    type ClientOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.Client,
        | 'id'
        | 'clientId'
        | 'clientKey'
        | 'clientSecret'
        | 'grantTypeList'
        | 'deviceType'
        | 'activeTimeout'
        | 'timeout'
        | 'status'
      >
    >;

    /** client list */
    type ClientList = Api.Common.PaginatingQueryRecord<Client>;

    /** social source */
    type SocialSource =
      | 'maxkey'
      | 'topiam'
      | 'qq'
      | 'weibo'
      | 'gitee'
      | 'dingtalk'
      | 'baidu'
      | 'csdn'
      | 'coding'
      | 'oschina'
      | 'alipay_wallet'
      | 'wechat_open'
      | 'wechat_mp'
      | 'wechat_enterprise'
      | 'gitlab'
      | 'github';

    /** oss */
    type Oss = Common.CommonRecord<{
      /** 对象存储主键 */
      ossId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 文件名 */
      fileName: string;
      /** 原名 */
      originalName: string;
      /** 文件后缀名 */
      fileSuffix: string;
      /** URL地址 */
      url: string;
      /** 扩展属性 */
      ext1: string;
      /** 服务商 */
      service: string;
      /** 创建者名称 */
      createByName: string;
    }>;

    /** oss search params */
    type OssSearchParams = CommonType.RecordNullable<
      Pick<Api.System.Oss, 'fileName' | 'originalName' | 'fileSuffix' | 'service'> & Api.Common.CommonSearchParams
    >;

    /** oss list */
    type OssList = Api.Common.PaginatingQueryRecord<Oss>;

    /** oss access policy */
    type OssAccessPolicy = '0' | '1' | '2';

    /** oss config */
    type OssConfig = Common.CommonRecord<{
      /** 主键 */
      ossConfigId: CommonType.IdType;
      /** 租户编号 */
      tenantId: CommonType.IdType;
      /** 配置名称 */
      configKey: string;
      /** accessKey */
      accessKey: string;
      /** 秘钥secretKey */
      secretKey: string;
      /** 桶名称 */
      bucketName: string;
      /** 前缀 */
      prefix: string;
      /** 访问站点 */
      endpoint: string;
      /** 自定义域名 */
      domain: string;
      /** 是否https（Y=是,N=否） */
      isHttps: Common.YesOrNoStatus;
      /** 域 */
      region: string;
      /** 桶权限类型 */
      accessPolicy: System.OssAccessPolicy;
      /** 是否默认（0=是,1=否） */
      status: Common.EnableStatus;
      /** 扩展字段 */
      ext1: string;
      /** 备注 */
      remark: string;
    }>;

    /** oss config search params */
    type OssConfigSearchParams = CommonType.RecordNullable<
      Pick<Api.System.OssConfig, 'configKey' | 'bucketName' | 'region' | 'status'> & Api.Common.CommonSearchParams
    >;

    /** oss config operate params */
    type OssConfigOperateParams = CommonType.RecordNullable<
      Pick<
        Api.System.OssConfig,
        | 'ossConfigId'
        | 'configKey'
        | 'accessKey'
        | 'secretKey'
        | 'bucketName'
        | 'prefix'
        | 'endpoint'
        | 'domain'
        | 'isHttps'
        | 'region'
        | 'accessPolicy'
        | 'status'
        | 'remark'
      >
    >;

    /** oss config list */
    type OssConfigList = Api.Common.PaginatingQueryRecord<OssConfig>;
  }
}
