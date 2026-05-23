-- 工作流要启用的页面
UPDATE `sys_menu` SET `status` = '0' WHERE `menu_id` IN ( '1761400000000011616', '1761400000000011618', '1761400000000011638', '1761400000000011700' );

-- 工作流菜单
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'hugeicons:flow-square' WHERE `menu_id` = '1761400000000011616';
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'fluent:notepad-person-16-regular' WHERE `menu_id` = '1761400000000011618';
UPDATE `sys_menu` SET `component` = 'workflow/task/taskWaiting/index', `icon` = 'ri:todo-line' WHERE `menu_id` = '1761400000000011619';
UPDATE `sys_menu` SET `icon` = 'weui:setting-outlined' WHERE `menu_id` = '1761400000000011620';
UPDATE `sys_menu` SET `icon` = 'ri:instance-line' WHERE `menu_id` = '1761400000000011621';
UPDATE `sys_menu` SET `icon` = 'carbon:category' WHERE `menu_id` = '1761400000000011622';
UPDATE `sys_menu` SET `component` = 'workflow/task/myDocument/index', `icon` = 'hugeicons:start-up-02' WHERE `menu_id` = '1761400000000011629';
UPDATE `sys_menu` SET `component` = 'Layout', `icon` = 'lucide:monitor-cog' WHERE `menu_id` = '1761400000000011630';
UPDATE `sys_menu` SET `component` = 'workflow/task/allTaskWaiting/index', `icon` = 'ri:todo-line' WHERE `menu_id` = '1761400000000011631';
UPDATE `sys_menu` SET `component` = 'workflow/task/taskFinish/index', `icon` = 'hugeicons:task-done-01' WHERE `menu_id` = '1761400000000011632';
UPDATE `sys_menu` SET `path` = 'taskCopy', `component` = 'workflow/task/taskCopy/index', `icon` = 'mynaui:copy' WHERE `menu_id` = '1761400000000011633';
UPDATE `sys_menu` SET `icon` = 'ic:twotone-time-to-leave' WHERE `menu_id` = '1761400000000011638';
UPDATE `sys_menu` SET `icon` = 'material-symbols:design-services-outline', `path` = 'design', `component` = 'workflow/design/index' WHERE `menu_id` = '1761400000000011700';
UPDATE `sys_menu` SET `icon` = 'ic:twotone-time-to-leave', `component` = 'workflow/leave/index' WHERE `menu_id` = '1761400000000011701';
UPDATE `sys_menu` SET `icon` = 'material-symbols:regular-expression-rounded' WHERE `menu_id` = '1761400000000011801';
