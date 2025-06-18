-- 修改字典数据表的 list_class 字段，将 danger 改为 error
UPDATE `sys_dict_data` SET `list_class` = 'error' WHERE `list_class` = 'danger';

-- 字典适配多语言
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.male' WHERE `dict_code` = 1;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.female' WHERE `dict_code` = 2;
UPDATE `sys_dict_data` SET `dict_label` = 'dict.sys_user_sex.unknown' WHERE `dict_code` = 3;
