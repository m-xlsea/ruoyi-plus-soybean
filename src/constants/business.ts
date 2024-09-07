import { transformRecordToOption } from '@/utils/common';

/** enable status */
export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  '0': '启用',
  '1': '禁用'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

/** menu type */
export const menuTypeRecord: Record<Api.System.MenuType, string> = {
  M: '目录',
  C: '菜单',
  F: '按钮'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

/** menu is frame */
export const menuIsFrameRecord: Record<Api.System.IsMenuFrame, string> = {
  '0': '缓存',
  '1': '不缓存',
  '2': 'iframe'
};

export const menuIsFrameOptions = transformRecordToOption(menuIsFrameRecord);

/** menu icon type */
export const menuIconTypeRecord: Record<Api.System.IconType, string> = {
  '1': 'iconify',
  '2': '本地图标'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

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
  datetime: '日期控件',
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
