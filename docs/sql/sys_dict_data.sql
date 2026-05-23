-- 修改字典数据表的 list_class 字段，将 danger 改为 error
UPDATE `sys_dict_data` SET `list_class` = 'error' WHERE `list_class` = 'danger';

-- 字典适配多语言
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.male', `dict_type` = 'sys_user_sex' WHERE `dict_code` ='1761600000000000001';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.female', `dict_type` = 'sys_user_sex' WHERE `dict_code` ='1761600000000000002';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.unknown', `dict_type` = 'sys_user_sex' WHERE `dict_code` ='1761600000000000003';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_show_hide.show', `dict_type` = 'sys_show_hide' WHERE `dict_code` ='1761600000000000004';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_show_hide.hide', `dict_type` = 'sys_show_hide' WHERE `dict_code` ='1761600000000000005';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_normal_disable.normal', `dict_type` = 'sys_normal_disable' WHERE `dict_code` ='1761600000000000006';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_normal_disable.disable', `dict_type` = 'sys_normal_disable' WHERE `dict_code` ='1761600000000000007';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_yes_no.yes', `dict_type` = 'sys_yes_no' WHERE `dict_code` = '1761600000000000012';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_yes_no.no', `dict_type` = 'sys_yes_no' WHERE `dict_code` = '1761600000000000013';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_type.notice', `dict_type` = 'sys_notice_type' WHERE `dict_code` = '1761600000000000014';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_type.announcement', `dict_type` = 'sys_notice_type' WHERE `dict_code` = '1761600000000000015';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_status.normal', `dict_type` = 'sys_notice_status' WHERE `dict_code` = '1761600000000000016';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_status.close', `dict_type` = 'sys_notice_status' WHERE `dict_code` = '1761600000000000017';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.insert', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000018';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.update', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000019';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.delete', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000020';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.grant', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000021';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.export', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000022';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.import', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000023';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.force', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000024';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.gencode', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000025';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.clean', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000026';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_common_status.success', `dict_type` = 'sys_common_status' WHERE `dict_code` = '1761600000000000027';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_common_status.fail', `dict_type` = 'sys_common_status' WHERE `dict_code` = '1761600000000000028';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.other', `dict_type` = 'sys_oper_type' WHERE `dict_code` = '1761600000000000029';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.password', `dict_type` = 'sys_grant_type' WHERE `dict_code` = '1761600000000000030';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.sms', `dict_type` = 'sys_grant_type' WHERE `dict_code` = '1761600000000000031';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.email', `dict_type` = 'sys_grant_type' WHERE `dict_code` = '1761600000000000032';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.miniapp', `dict_type` = 'sys_grant_type' WHERE `dict_code` = '1761600000000000033';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.social', `dict_type` = 'sys_grant_type' WHERE `dict_code` = '1761600000000000034';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.pc', `dict_type` = 'sys_device_type' WHERE `dict_code` = '1761600000000000035';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.android', `dict_type` = 'sys_device_type' WHERE `dict_code` = '1761600000000000036';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.ios', `dict_type` = 'sys_device_type' WHERE `dict_code` = '1761600000000000037';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.miniapp', `dict_type` = 'sys_device_type' WHERE `dict_code` = '1761600000000000038';
