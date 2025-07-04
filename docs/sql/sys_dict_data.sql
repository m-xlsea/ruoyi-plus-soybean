-- 修改字典数据表的 list_class 字段，将 danger 改为 error
UPDATE `sys_dict_data` SET `list_class` = 'error' WHERE `list_class` = 'danger';

-- 字典适配多语言
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.male', `dict_type` = 'sys_user_sex' WHERE `dict_code` = 1;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.female', `dict_type` = 'sys_user_sex' WHERE `dict_code` = 2;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.unknown', `dict_type` = 'sys_user_sex' WHERE `dict_code` = 3;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_show_hide.show', `dict_type` = 'sys_show_hide' WHERE `dict_code` = 4;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_show_hide.hide', `dict_type` = 'sys_show_hide' WHERE `dict_code` = 5;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_normal_disable.normal', `dict_type` = 'sys_normal_disable' WHERE `dict_code` = 6;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_normal_disable.disable', `dict_type` = 'sys_normal_disable' WHERE `dict_code` = 7;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_yes_no.yes', `dict_type` = 'sys_yes_no' WHERE `dict_code` = 12;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_yes_no.no', `dict_type` = 'sys_yes_no' WHERE `dict_code` = 13;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_type.notice', `dict_type` = 'sys_notice_type' WHERE `dict_code` = 14;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_type.announcement', `dict_type` = 'sys_notice_type' WHERE `dict_code` = 15;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_status.normal', `dict_type` = 'sys_notice_status' WHERE `dict_code` = 16;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_notice_status.close', `dict_type` = 'sys_notice_status' WHERE `dict_code` = 17;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.insert', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 18;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.update', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 19;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.delete', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 20;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.grant', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 21;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.export', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 22;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.import', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 23;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.force', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 24;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.gencode', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 25;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.clean', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 26;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_common_status.success', `dict_type` = 'sys_common_status' WHERE `dict_code` = 27;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_common_status.fail', `dict_type` = 'sys_common_status' WHERE `dict_code` = 28;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_oper_type.other', `dict_type` = 'sys_oper_type' WHERE `dict_code` = 29;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.password', `dict_type` = 'sys_grant_type' WHERE `dict_code` = 30;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.sms', `dict_type` = 'sys_grant_type' WHERE `dict_code` = 31;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.email', `dict_type` = 'sys_grant_type' WHERE `dict_code` = 32;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.miniapp', `dict_type` = 'sys_grant_type' WHERE `dict_code` = 33;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_grant_type.social', `dict_type` = 'sys_grant_type' WHERE `dict_code` = 34;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.pc', `dict_type` = 'sys_device_type' WHERE `dict_code` = 35;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.android', `dict_type` = 'sys_device_type' WHERE `dict_code` = 36;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.ios', `dict_type` = 'sys_device_type' WHERE `dict_code` = 37;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_device_type.miniapp', `dict_type` = 'sys_device_type' WHERE `dict_code` = 38;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.revoked', `dict_type` = 'wf_business_status' WHERE `dict_code` = 39;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.draft', `dict_type` = 'wf_business_status' WHERE `dict_code` = 40;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.pending', `dict_type` = 'wf_business_status' WHERE `dict_code` = 41;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.completed', `dict_type` = 'wf_business_status' WHERE `dict_code` = 42;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.cancelled', `dict_type` = 'wf_business_status' WHERE `dict_code` = 43;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.returned', `dict_type` = 'wf_business_status' WHERE `dict_code` = 44;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.terminated', `dict_type` = 'wf_business_status' WHERE `dict_code` = 45;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_form_type.custom_form', `dict_type` = 'wf_form_type' WHERE `dict_code` = 46;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_form_type.dynamic_form', `dict_type` = 'wf_form_type' WHERE `dict_code` = 47;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.revoke', `dict_type` = 'wf_task_status' WHERE `dict_code` = 48;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.pass', `dict_type` = 'wf_task_status' WHERE `dict_code` = 49;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.pending_review', `dict_type` = 'wf_task_status' WHERE `dict_code` = 50;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.cancel', `dict_type` = 'wf_task_status' WHERE `dict_code` = 51;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.return', `dict_type` = 'wf_task_status' WHERE `dict_code` = 52;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.terminate', `dict_type` = 'wf_task_status' WHERE `dict_code` = 53;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.transfer', `dict_type` = 'wf_task_status' WHERE `dict_code` = 54;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.delegate', `dict_type` = 'wf_task_status' WHERE `dict_code` = 55;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.copy', `dict_type` = 'wf_task_status' WHERE `dict_code` = 56;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.add_sign', `dict_type` = 'wf_task_status' WHERE `dict_code` = 57;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.minus_sign', `dict_type` = 'wf_task_status' WHERE `dict_code` = 58;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.timeout', `dict_type` = 'wf_task_status' WHERE `dict_code` = 59;
