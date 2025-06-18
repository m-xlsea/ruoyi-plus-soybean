-- 目录类型菜单
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'carbon:cloud-service-management', `menu_name` = 'route.system' WHERE `menu_id` = 1;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'stash:dashboard', `menu_name` = 'route.monitor' WHERE `menu_id` = 2;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:tools', `menu_name` = 'route.tool' WHERE `menu_id` = 3;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'material-symbols:kid-star-outline', `menu_name` = 'route.demo' WHERE `menu_id` = 5;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:building-cog', `menu_name` = 'menu.system_tenant' WHERE `menu_id` = 6;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:logs', `menu_name` = 'menu.system_log' WHERE `menu_id` = 108;

-- 页面类型
UPDATE `sys_menu` SET `icon` = 'ic:round-manage-accounts', `menu_name` = 'route.system_user' WHERE `menu_id` = 100;
UPDATE `sys_menu` SET `icon` = 'carbon:user-role', `menu_name` = 'route.system_role' WHERE `menu_id` = 101;
UPDATE `sys_menu` SET `icon` = 'material-symbols:route', `menu_name` = 'route.system_menu' WHERE `menu_id` = 102;
UPDATE `sys_menu` SET `icon` = 'mingcute:department-line', `menu_name` = 'route.system_dept' WHERE `menu_id` = 103;
UPDATE `sys_menu` SET `icon` = 'hugeicons:permanent-job', `menu_name` = 'route.system_post' WHERE `menu_id` = 104;
UPDATE `sys_menu` SET `icon` = 'qlementine-icons:dictionary-16', `menu_name` = 'route.system_dict' WHERE `menu_id` = 105;
UPDATE `sys_menu` SET `icon` = 'carbon:parameter', `menu_name` = 'route.system_config' WHERE `menu_id` = 106;
UPDATE `sys_menu` SET `icon` = 'solar:chat-line-outline', `menu_name` = 'route.system_notice' WHERE `menu_id` = 107;
UPDATE `sys_menu` SET `icon` = 'majesticons:status-online-line', `menu_name` = 'route.monitor_online' WHERE `menu_id` = 109;
UPDATE `sys_menu` SET `icon` = 'simple-icons:redis', `menu_name` = 'route.monitor_cache' WHERE `menu_id` = 113;
UPDATE `sys_menu` SET `icon` = 'material-symbols:code-blocks-outline', `menu_name` = 'route.tool_gen' WHERE `menu_id` = 115;
UPDATE `sys_menu` SET `icon` = 'material-symbols:attach-file', `menu_name` = 'route.system_oss' WHERE `menu_id` = 118;
UPDATE `sys_menu` SET `icon` = 'tabler:building-skyscraper', `menu_name` = 'route.system_tenant' WHERE `menu_id` = 121;
UPDATE `sys_menu` SET `icon` = 'lets-icons:package-box-alt', `menu_name` = 'route.system_tenant-package' WHERE `menu_id` = 122;
UPDATE `sys_menu` SET `icon` = 'tabler:device-imac-cog', `menu_name` = 'route.system_client' WHERE `menu_id` = 123;
UPDATE `sys_menu` SET `icon` = 'carbon:operations-record', `menu_name` = 'route.monitor_operlog' WHERE `menu_id` = 500;
UPDATE `sys_menu` SET `icon` = 'tabler:login-2', `menu_name` = 'route.monitor_logininfor' WHERE `menu_id` = 501;
UPDATE `sys_menu` SET `icon` = 'gg:debug', `menu_name` = 'route.demo_demo' WHERE `menu_id` = 1500;
UPDATE `sys_menu` SET `icon` = 'gg:debug', `menu_name` = 'route.demo_tree' WHERE `menu_id` = 1506;
UPDATE `sys_menu` SET `path` = 'oss/config', `component` = 'system/oss-config/index', `icon` = 'hugeicons:configuration-01', `menu_name` = 'route.system_oss-config' WHERE `menu_id` = 133;

-- IFrame 类型
UPDATE `sys_menu` SET `component` = 'FrameView', `query_param` = 'https://ruoyi.xlsea.cn/admin/', `is_frame` = 2, `icon` = 'bx:bxl-spring-boot', `menu_name` = 'menu.monitor_admin' WHERE `menu_id` = 117;
UPDATE `sys_menu` SET `component` = 'FrameView', `query_param` = 'https://preview.snailjob.opensnail.com/', `is_frame` = 2, `icon` = 'gridicons:scheduled', `menu_name` = 'menu.monitor_snail-job' WHERE `menu_id` = 120;
-- 外链类型
UPDATE `sys_menu` SET `path` = 'https://gitee.com/xlsea/ruoyi-plus-soybean', `component` = 'FrameView', `icon` = 'local-icon-gitee', `menu_name` = 'RuoYi-Plus-Soybean' WHERE `menu_id` = 4;

-- plus-ui 需要禁用的页面
UPDATE `sys_menu` SET `status` = '1' WHERE `menu_id` IN ( '116', '130', '131', '132', '11700', '11701' );
