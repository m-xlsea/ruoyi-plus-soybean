-- 目录类型菜单
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'carbon:cloud-service-management', `menu_name` = 'route.system' WHERE `menu_id` = '1761400000000000001';
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'stash:dashboard', `menu_name` = 'route.monitor' WHERE `menu_id` = '1761400000000000002';
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:tools', `menu_name` = 'route.tool' WHERE `menu_id` = '1761400000000000003';
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'material-symbols:kid-star-outline', `menu_name` = 'route.demo' WHERE `menu_id` = '1761400000000000005';
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:logs', `menu_name` = 'menu.system_log' WHERE `menu_id` = '1761400000000000108';

-- 页面类型
UPDATE `sys_menu` SET `icon` = 'ic:round-manage-accounts', `menu_name` = 'route.system_user' WHERE `menu_id` = '1761400000000000100';
UPDATE `sys_menu` SET `icon` = 'carbon:user-role', `menu_name` = 'route.system_role' WHERE `menu_id` = '1761400000000000101';
UPDATE `sys_menu` SET `icon` = 'material-symbols:route', `menu_name` = 'route.system_menu' WHERE `menu_id` = '1761400000000000102';
UPDATE `sys_menu` SET `icon` = 'mingcute:department-line', `menu_name` = 'route.system_dept' WHERE `menu_id` = '1761400000000000103';
UPDATE `sys_menu` SET `icon` = 'hugeicons:permanent-job', `menu_name` = 'route.system_post' WHERE `menu_id` = '1761400000000000104';
UPDATE `sys_menu` SET `icon` = 'qlementine-icons:dictionary-16', `menu_name` = 'route.system_dict' WHERE `menu_id` = '1761400000000000105';
UPDATE `sys_menu` SET `icon` = 'carbon:parameter', `menu_name` = 'route.system_config' WHERE `menu_id` = '1761400000000000106';
UPDATE `sys_menu` SET `icon` = 'solar:chat-line-outline', `menu_name` = 'route.system_notice' WHERE `menu_id` = '1761400000000000107';
UPDATE `sys_menu` SET `icon` = 'majesticons:status-online-line', `menu_name` = 'route.monitor_online' WHERE `menu_id` = '1761400000000000109';
UPDATE `sys_menu` SET `icon` = 'simple-icons:redis', `menu_name` = 'route.monitor_cache' WHERE `menu_id` = '1761400000000000113';
UPDATE `sys_menu` SET `icon` = 'material-symbols:code-blocks-outline', `menu_name` = 'route.tool_gen' WHERE `menu_id` = '1761400000000000115';
UPDATE `sys_menu` SET `icon` = 'material-symbols:attach-file', `menu_name` = 'route.system_oss' WHERE `menu_id` = '1761400000000000118';
UPDATE `sys_menu` SET `icon` = 'tabler:device-imac-cog', `menu_name` = 'route.system_client' WHERE `menu_id` = '1761400000000000123';
UPDATE `sys_menu` SET `icon` = 'carbon:operations-record', `menu_name` = 'route.monitor_operlog' WHERE `menu_id` = '1761400000000000500';
UPDATE `sys_menu` SET `icon` = 'tabler:login-2', `menu_name` = 'route.monitor_logininfor' WHERE `menu_id` = '1761400000000000501';
UPDATE `sys_menu` SET `icon` = 'gg:debug', `menu_name` = 'route.demo_demo' WHERE `menu_id` = '1761400000000001500';
UPDATE `sys_menu` SET `icon` = 'gg:debug', `menu_name` = 'route.demo_tree' WHERE `menu_id` = '1761400000000001506';
UPDATE `sys_menu` SET `path` = 'oss/config', `component` = 'system/oss-config/index', `icon` = 'hugeicons:configuration-01', `menu_name` = 'route.system_oss-config' WHERE `menu_id` = '1761400000000000133';
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query_param`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_dept`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('1761400000000000009', 'route.about', 0, 99, 'about', 'about/index', '', 1, 1, 'C', '0', '0', '', 'fluent:book-information-24-regular', 103, 1, sysdate(), null, null, '关于页面') ON DUPLICATE KEY UPDATE `update_time` = sysdate();

-- IFrame 类型
UPDATE `sys_menu` SET `component` = 'FrameView', `query_param` = '{"url":"https://ruoyi.xlsea.cn/admin/"}', `is_frame` = 2, `icon` = 'bx:bxl-spring-boot', `menu_name` = 'menu.monitor_admin' WHERE `menu_id` = '1761400000000000117';
UPDATE `sys_menu` SET `component` = 'FrameView', `query_param` = '{"url":"https://preview.snailjob.opensnail.com/"}', `is_frame` = 2, `icon` = 'gridicons:scheduled', `menu_name` = 'menu.monitor_snail-job' WHERE `menu_id` = '1761400000000000120';
-- 外链类型
UPDATE `sys_menu` SET `menu_name` = 'RuoYi-Vue-Plus', `order_num` = 100, `path` = 'https://gitee.com/dromara/RuoYi-Vue-Plus', `component` = 'FrameView', `icon` = 'local-icon-gitee', `remark` = 'RuoYi-Vue-Plus 仓库地址' WHERE `menu_id` = '1761400000000000004';
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query_param`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_dept`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('1761400000000000007', 'Soybean Admin', 0, 100, 'https://github.com/soybeanjs', 'FrameView', '', 0, 0, 'M', '0', '0', '', 'mdi:github', 103, 1, sysdate(), null, null, 'Soybean Admin 仓库地址') ON DUPLICATE KEY UPDATE `update_time` = sysdate();
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query_param`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_dept`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES ('1761400000000000008', 'RuoYi-Plus-Soybean', 0, 100, 'https://gitee.com/xlsea/ruoyi-plus-soybean', 'FrameView', '', 0, 0, 'M', '0', '0', '', 'local-icon-gitee', 103, 1, sysdate(), null, null, 'RuoYi-Plus-Soybean 仓库地址') ON DUPLICATE KEY UPDATE `update_time` = sysdate();

-- plus-ui 需要禁用的页面
UPDATE `sys_menu` SET `status` = '1' WHERE `menu_id` IN ( '1761400000000000116', '1761400000000000130', '1761400000000000131', '1761400000000000132' );
-- 工作流需要禁用的页面
UPDATE `sys_menu` SET `status` = '1' WHERE `menu_id` IN ( '1761400000000011616', '1761400000000011618', '1761400000000011638', '1761400000000011700', '1761400000000011701' );
