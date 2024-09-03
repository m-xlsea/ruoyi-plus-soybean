/**
 * 构造树型结构数据
 *
 * @param {any} data 数据源
 * @param {any} id id字段 默认 'id'
 * @param {any} parentId 父节点字段 默认 'parentId'
 * @param {any} children 孩子节点字段 默认 'children'
 */
export const handleMenuTree = (
  data: Api.System.MenuList,
  id: keyof Api.System.Menu,
  parentId?: keyof Api.System.Menu,
  children?: keyof Api.System.Menu
  // eslint-disable-next-line max-params
): Api.System.MenuList => {
  const config: {
    id: keyof Api.System.Menu;
    parentId: keyof Api.System.Menu;
    childrenList: keyof Api.System.Menu;
  } = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  const childrenListMap: any = {};
  const nodeIds: any = {};
  const tree: Api.System.MenuList = [];

  for (const d of data) {
    const pid = d[config.parentId];
    if (!childrenListMap[pid]) {
      childrenListMap[pid] = [];
    }
    nodeIds[d[config.id]] = d;
    if (d.menuType !== 'F') {
      childrenListMap[pid].push(d);
    }

    if (childrenListMap[pid].length === 0) {
      childrenListMap[pid] = undefined;
    }
  }

  for (const d of data) {
    const pid = d[config.parentId];
    if (!nodeIds[pid]) {
      tree.push(d);
    }
  }
  const adaptToChildrenList = (o: any) => {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  };

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  return tree;
};
