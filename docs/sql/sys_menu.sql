-- 目录类型菜单
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'carbon:cloud-service-management' WHERE `menu_id` = 1;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'stash:dashboard' WHERE `menu_id` = 2;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:tools' WHERE `menu_id` = 3;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'material-symbols:kid-star-outline' WHERE `menu_id` = 5;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:building-cog' WHERE `menu_id` = 6;
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'tabler:logs' WHERE `menu_id` = 108;

-- 页面类型
UPDATE `sys_menu` SET `icon` = 'ic:round-manage-accounts' WHERE `menu_id` = 100;
UPDATE `sys_menu` SET `icon` = 'carbon:user-role' WHERE `menu_id` = 101;
UPDATE `sys_menu` SET `icon` = 'material-symbols:route' WHERE `menu_id` = 102;
UPDATE `sys_menu` SET `icon` = 'mingcute:department-line' WHERE `menu_id` = 103;
UPDATE `sys_menu` SET `icon` = 'hugeicons:permanent-job' WHERE `menu_id` = 104;
UPDATE `sys_menu` SET `icon` = 'qlementine-icons:dictionary-16' WHERE `menu_id` = 105;
UPDATE `sys_menu` SET `icon` = 'carbon:parameter' WHERE `menu_id` = 106;
UPDATE `sys_menu` SET `icon` = 'solar:chat-line-outline' WHERE `menu_id` = 107;
UPDATE `sys_menu` SET `icon` = 'majesticons:status-online-line' WHERE `menu_id` = 109;
UPDATE `sys_menu` SET `icon` = 'simple-icons:redis' WHERE `menu_id` = 113;
UPDATE `sys_menu` SET `icon` = 'material-symbols:code-blocks-outline' WHERE `menu_id` = 115;
UPDATE `sys_menu` SET `icon` = 'material-symbols:attach-file' WHERE `menu_id` = 118;
UPDATE `sys_menu` SET `icon` = 'tabler:building-skyscraper' WHERE `menu_id` = 121;
UPDATE `sys_menu` SET `icon` = 'lets-icons:package-box-alt' WHERE `menu_id` = 122;
UPDATE `sys_menu` SET `icon` = 'tabler:device-imac-cog' WHERE `menu_id` = 123;
UPDATE `sys_menu` SET `icon` = 'carbon:operations-record' WHERE `menu_id` = 500;
UPDATE `sys_menu` SET `icon` = 'tabler:login-2' WHERE `menu_id` = 501;
UPDATE `sys_menu` SET `icon` = 'gg:debug' WHERE `menu_id` = 1500;
UPDATE `sys_menu` SET `icon` = 'gg:debug' WHERE `menu_id` = 1506;
UPDATE `sys_menu` SET `path` = 'oss/config', `component` = 'system/oss-config/index', `icon` = 'hugeicons:configuration-01' WHERE `menu_id` = 133;

-- IFrame 类型
UPDATE `sys_menu` SET `component` = 'FrameView', `query_param` = 'https://ruoyi.xlsea.cn/admin/', `is_frame` = 2, `icon` = 'bx:bxl-spring-boot' WHERE `menu_id` = 117;
UPDATE `sys_menu` SET `component` = 'FrameView', `query_param` = 'https://preview.snailjob.opensnail.com/', `is_frame` = 2, `icon` = 'gridicons:scheduled' WHERE `menu_id` = 120;
-- 外链类型
UPDATE `sys_menu` SET `path` = 'https://gitee.com/xlsea/ruoyi-plus-soybean', `component` = 'FrameView', `icon` = 'local-icon-gitee' WHERE `menu_id` = 4;

-- plus-ui 需要禁用的页面
UPDATE `sys_menu` SET `status` = '1' WHERE `menu_id` IN ( '116', '130', '131', '132', '11700', '11701' );

-- 工作流菜单
UPDATE `sys_menu` SET `component` = 'workflow/processDefinition/design/index' WHERE `menu_id` = 11700;

