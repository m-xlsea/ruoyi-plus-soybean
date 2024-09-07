    /**
     * 查询系统菜单列表
     *
     * @param menu 菜单信息
     * @return 菜单列表
     */
    @Override
    public List<SysMenuVo> selectMenuList(SysMenuBo menu, Long userId) {
        List<SysMenuVo> menuList;
        // 管理员显示所有菜单信息
        if (LoginHelper.isSuperAdmin(userId)) {
            menuList = baseMapper.selectVoList(new LambdaQueryWrapper<SysMenu>()
                .like(StringUtils.isNotBlank(menu.getMenuName()), SysMenu::getMenuName, menu.getMenuName())
                .eq(StringUtils.isNotBlank(menu.getVisible()), SysMenu::getVisible, menu.getVisible())
                .eq(StringUtils.isNotBlank(menu.getStatus()), SysMenu::getStatus, menu.getStatus())
                .eq(StringUtils.isNotBlank(menu.getMenuType()), SysMenu::getMenuType, menu.getMenuType())
                .eq(ObjectUtil.isNotNull(menu.getParentId()), SysMenu::getParentId, menu.getParentId())
                .orderByAsc(SysMenu::getParentId)
                .orderByAsc(SysMenu::getOrderNum));
        } else {
            QueryWrapper<SysMenu> wrapper = Wrappers.query();
            wrapper.inSql("r.role_id", "select role_id from sys_user_role where user_id = " + userId)
                .like(StringUtils.isNotBlank(menu.getMenuName()), "m.menu_name", menu.getMenuName())
                .eq(StringUtils.isNotBlank(menu.getVisible()), "m.visible", menu.getVisible())
                .eq(StringUtils.isNotBlank(menu.getStatus()), "m.status", menu.getStatus())
                .eq(StringUtils.isNotBlank(menu.getMenuType()), "m.menu_type", menu.getMenuType())
                .eq(ObjectUtil.isNotNull(menu.getParentId()), "m.parent_id", menu.getParentId())
                .orderByAsc("m.parent_id")
                .orderByAsc("m.order_num");
            List<SysMenu> list = baseMapper.selectMenuListByUserId(wrapper);
            menuList = MapstructUtils.convert(list, SysMenuVo.class);
        }
        return menuList;
    }
