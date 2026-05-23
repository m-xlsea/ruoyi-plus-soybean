-- 修改字典数据表的 list_class 字段，将 danger 改为 error
UPDATE `sys_dict_data` SET `list_class` = 'error' WHERE `list_class` = 'danger';

-- 字典适配多语言
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_gender.male' WHERE `dict_code` ='1761600000000000001';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_gender.female' WHERE `dict_code` ='1761600000000000002';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_gender.unknown' WHERE `dict_code` ='1761600000000000003';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_show_hide.show' WHERE `dict_code` ='1761600000000000004';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_show_hide.hide' WHERE `dict_code` ='1761600000000000005';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_normal_disable.normal' WHERE `dict_code` ='1761600000000000006';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_normal_disable.disable' WHERE `dict_code` ='1761600000000000007';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_yes_no.yes' WHERE `dict_code` = '1761600000000000012';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_yes_no.no' WHERE `dict_code` = '1761600000000000013';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_type.notice' WHERE `dict_code` = '1761600000000000014';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_type.announcement' WHERE `dict_code` = '1761600000000000015';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_status.normal' WHERE `dict_code` = '1761600000000000016';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_status.close' WHERE `dict_code` = '1761600000000000017';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.insert' WHERE `dict_code` = '1761600000000000018';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.update' WHERE `dict_code` = '1761600000000000019';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.delete' WHERE `dict_code` = '1761600000000000020';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.grant' WHERE `dict_code` = '1761600000000000021';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.export' WHERE `dict_code` = '1761600000000000022';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.import' WHERE `dict_code` = '1761600000000000023';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.force' WHERE `dict_code` = '1761600000000000024';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.gencode' WHERE `dict_code` = '1761600000000000025';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.clean' WHERE `dict_code` = '1761600000000000026';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_common_status.success' WHERE `dict_code` = '1761600000000000027';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_common_status.fail' WHERE `dict_code` = '1761600000000000028';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.other' WHERE `dict_code` = '1761600000000000029';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.password' WHERE `dict_code` = '1761600000000000030';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.sms' WHERE `dict_code` = '1761600000000000031';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.email' WHERE `dict_code` = '1761600000000000032';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.miniapp' WHERE `dict_code` = '1761600000000000033';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.social' WHERE `dict_code` = '1761600000000000034';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.pc' WHERE `dict_code` = '1761600000000000035';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.android' WHERE `dict_code` = '1761600000000000036';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.ios' WHERE `dict_code` = '1761600000000000037';
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.miniapp' WHERE `dict_code` = '1761600000000000038';
