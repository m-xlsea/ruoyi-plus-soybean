-- 修改字典数据表的 list_class 字段，将 danger 改为 error
UPDATE `sys_dict_data` SET `list_class` = 'error' WHERE `list_class` = 'danger';

-- 字典适配多语言
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.revoked', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000039;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.draft', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000040;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.pending', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000041;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.completed', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000042;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.cancelled', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000043;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.returned', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000044;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.terminated', `dict_type` = 'wf_business_status' WHERE `dict_code` = 1761600000000000045;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_form_type.custom_form', `dict_type` = 'wf_form_type' WHERE `dict_code` = 1761600000000000046;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_form_type.dynamic_form', `dict_type` = 'wf_form_type' WHERE `dict_code` = 1761600000000000047;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.revoke', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000048;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.pass', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000049;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.pending_review', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000050;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.cancel', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000051;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.return', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000052;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.terminate', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000053;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.transfer', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000054;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.delegate', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000055;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.copy', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000056;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.add_sign', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000057;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.minus_sign', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000058;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.timeout', `dict_type` = 'wf_task_status' WHERE `dict_code` = 1761600000000000059;
