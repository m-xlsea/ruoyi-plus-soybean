import { transformRecordToOption } from '@/utils/common';

/** enable status */
export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  '0': '正常',
  '1': '停用'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

/** yes or no status */
export const yesOrNoStatusRecord: Record<Api.Common.YesOrNoStatus, string> = {
  Y: '是',
  N: '否'
};

export const yesOrNoStatusOptions = transformRecordToOption(yesOrNoStatusRecord);

/** menu type */
export const menuTypeRecord: Record<Api.System.MenuType, string> = {
  M: '目录',
  C: '菜单',
  F: '按钮'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

/** menu is frame */
export const menuIsFrameRecord: Record<Api.System.IsMenuFrame, string> = {
  '0': '是',
  '1': '否',
  '2': 'iframe'
};

export const menuIsFrameOptions = transformRecordToOption(menuIsFrameRecord);

/** menu icon type */
export const menuIconTypeRecord: Record<Api.System.IconType, string> = {
  '1': 'iconify',
  '2': '本地图标'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

/** menu layout */
export const menuLayoutRecord: Record<Api.System.MenuLayout, string> = {
  '0': '默认布局',
  '1': '空白布局'
};

export const menuLayoutOptions = transformRecordToOption(menuLayoutRecord);

/** gen java type */
export const genJavaTypeRecord: Record<Api.Tool.JavaType, string> = {
  Long: 'Long',
  String: 'String',
  Integer: 'Integer',
  Double: 'Double',
  BigDecimal: 'BigDecimal',
  Date: 'Date',
  Boolean: 'Boolean'
};

export const genJavaTypeOptions = transformRecordToOption(genJavaTypeRecord);

/** gen query type */
export const genQueryTypeRecord: Record<Api.Tool.QueryType, string> = {
  EQ: '=',
  NE: '!=',
  GT: '>',
  GE: '>=',
  LT: '<',
  LE: '<=',
  LIKE: 'LIKE',
  BETWEEN: 'BETWEEN'
};

export const genQueryTypeOptions = transformRecordToOption(genQueryTypeRecord);

/** gen html type */
export const genHtmlTypeRecord: Record<Api.Tool.HtmlType, string> = {
  input: '文本框',
  textarea: '文本域',
  select: '下拉框',
  radio: '单选框',
  checkbox: '复选框',
  datetime: '日期时间控件',
  imageUpload: '图片上传',
  fileUpload: '文件上传',
  editor: '富文本控件'
};

export const genHtmlTypeOptions = transformRecordToOption(genHtmlTypeRecord);

/** gen type */
export const genTypeRecord: Record<Api.Tool.GenType, string> = {
  '0': 'ZIP 压缩包',
  '1': '自定义路径'
};

export const genTypeOptions = transformRecordToOption(genTypeRecord);

/** gen type */
export const genTplCategoryRecord: Record<Api.Tool.TplCategory, string> = {
  crud: '单表（增删改查）',
  tree: '树表（增删改查）'
};

export const genTplCategoryOptions = transformRecordToOption(genTplCategoryRecord);

/** oss config is https */
export const ossConfigIsHttpsRecord: Record<Api.Common.YesOrNoStatus, string> = {
  Y: 'https://',
  N: 'http://'
};

export const ossConfigIsHttpsOptions = transformRecordToOption(ossConfigIsHttpsRecord);

/** oss access policy */
export const ossAccessPolicyRecord: Record<Api.System.OssAccessPolicy, string> = {
  '0': '私有',
  '1': '公有',
  '2': '自定义'
};

export const ossAccessPolicyOptions = transformRecordToOption(ossAccessPolicyRecord);

/** data scope */
export const dataScopeRecord: Record<Api.System.DataScope, string> = {
  '1': '全部数据权限',
  '2': '自定数据权限',
  '3': '本部门数据权限',
  '4': '本部门及以下数据权限',
  '5': '仅本人数据权限',
  '6': '部门及以下或本人数据权限'
};

export const dataScopeOptions = transformRecordToOption(dataScopeRecord);
