import { effectScope, onScopeDispose, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { jsonClone } from '@sa/utils';
import { useBoolean, useHookTable } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { handleTree } from '@/utils/common';
import { $t } from '@/locales';

type TableData = NaiveUI.TableData;
type GetTableData<A extends NaiveUI.TreeTableApiFn> = NaiveUI.GetTreeTableData<A>;
type TableColumn<T> = NaiveUI.TableColumn<T>;

export function useTreeTable<A extends NaiveUI.TreeTableApiFn>(
  config: NaiveUI.NaiveTreeTableConfig<A> & CommonType.TreeConfig & { defaultExpandAll?: boolean }
) {
  const scope = effectScope();
  const appStore = useAppStore();

  const {
    apiFn,
    apiParams,
    immediate,
    idField,
    parentIdField = 'parentId',
    childrenField = 'children',
    defaultExpandAll = false
  } = config;

  const SELECTION_KEY = '__selection__';
  const EXPAND_KEY = '__expand__';

  const expandedRowKeys = ref<CommonType.IdType[]>([]);

  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  } = useHookTable<A, GetTableData<A>, TableColumn<NaiveUI.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: res => {
      const records = res.data || [];
      if (!records.length) return { data: [] };

      const treeData = handleTree(records, {
        idField,
        parentIdField,
        childrenField
      });

      // if defaultExpandAll is true, expand all nodes
      expandedRowKeys.value = defaultExpandAll
        ? records.map(item => item[idField])
        : records.filter(item => item[parentIdField] === 0).map(item => item[idField]) || [];

      return { data: treeData };
    },
    getColumnChecks: cols => {
      const checks: NaiveUI.TableColumnCheck[] = [];

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          checks.push({
            key: column.key as string,
            title: column.title as string,
            checked: true
          });
        } else if (column.type === 'selection') {
          checks.push({
            key: SELECTION_KEY,
            title: $t('common.check'),
            checked: true
          });
        } else if (column.type === 'expand') {
          checks.push({
            key: EXPAND_KEY,
            title: $t('common.expandColumn'),
            checked: true
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<GetTableData<A>>>();

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          columnMap.set(column.key as string, column);
        } else if (column.type === 'selection') {
          columnMap.set(SELECTION_KEY, column);
        } else if (column.type === 'expand') {
          columnMap.set(EXPAND_KEY, column);
        }
      });

      const filteredColumns = checks
        .filter(item => item.checked)
        .map(check => columnMap.get(check.key) as TableColumn<GetTableData<A>>);

      return filteredColumns;
    },
    immediate
  });

  /** 收集所有节点的key */
  function collectAllNodeKeys(treeNodes: any[]): CommonType.IdType[] {
    const keys: CommonType.IdType[] = [];

    const collect = (nodes: any[]) => {
      nodes.forEach(node => {
        keys.push(node[idField]);
        if (node[childrenField]?.length) {
          collect(node[childrenField]);
        }
      });
    };

    collect(treeNodes);
    return keys;
  }

  const { bool: isCollapse, toggle: toggleCollapse } = useBoolean(defaultExpandAll);

  /** expand all nodes */
  function expandAll() {
    toggleCollapse();
    expandedRowKeys.value = collectAllNodeKeys(data.value);
  }

  /** collapse all nodes */
  function collapseAll() {
    toggleCollapse();
    expandedRowKeys.value = [];
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams,
    expandedRowKeys,
    isCollapse,
    expandAll,
    collapseAll
  };
}

export function useTreeTableOperate<T extends TableData = TableData>(_: Ref<T[]>, getData: () => Promise<void>) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = ref<NaiveUI.TableOperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData: Ref<T | null> = ref(null);

  function handleEdit(row: T) {
    operateType.value = 'edit';
    editingData.value = jsonClone(row);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = ref<CommonType.IdType[]>([]);

  function clearCheckedRowKeys() {
    checkedRowKeys.value = [];
  }

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted,
    clearCheckedRowKeys
  };
}

function isTableColumnHasKey<T>(column: TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}
