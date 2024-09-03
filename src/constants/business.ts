import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  '0': '启用',
  '1': '禁用'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const menuTypeRecord: Record<Api.System.MenuType, string> = {
  M: '目录',
  C: '菜单',
  F: '按钮'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

/** menu icon type */
export const menuIconTypeRecord: Record<Api.System.IconType, string> = {
  '1': 'iconify',
  '2': '本地图标'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);
