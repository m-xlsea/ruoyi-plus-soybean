-- 修改字典数据表的 list_class 字段，将 danger 改为 error
UPDATE `sys_dict_data` SET `list_class` = 'error' WHERE `list_class` = 'danger';

-- 字典适配多语言
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.revoked' WHERE `dict_code` = 1761600000000000039;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.draft' WHERE `dict_code` = 1761600000000000040;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.pending' WHERE `dict_code` = 1761600000000000041;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.completed' WHERE `dict_code` = 1761600000000000042;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.cancelled' WHERE `dict_code` = 1761600000000000043;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.returned' WHERE `dict_code` = 1761600000000000044;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_business_status.terminated' WHERE `dict_code` = 1761600000000000045;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_form_type.custom_form' WHERE `dict_code` = 1761600000000000046;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_form_type.dynamic_form' WHERE `dict_code` = 1761600000000000047;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.revoke' WHERE `dict_code` = 1761600000000000048;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.pass' WHERE `dict_code` = 1761600000000000049;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.pending_review' WHERE `dict_code` = 1761600000000000050;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.cancel' WHERE `dict_code` = 1761600000000000051;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.return' WHERE `dict_code` = 1761600000000000052;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.terminate' WHERE `dict_code` = 1761600000000000053;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.transfer' WHERE `dict_code` = 1761600000000000054;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.delegate' WHERE `dict_code` = 1761600000000000055;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.copy' WHERE `dict_code` = 1761600000000000056;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.add_sign' WHERE `dict_code` = 1761600000000000057;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.minus_sign' WHERE `dict_code` = 1761600000000000058;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.wf_task_status.timeout' WHERE `dict_code` = 1761600000000000059;
