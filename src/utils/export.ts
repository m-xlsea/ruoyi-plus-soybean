import { utils, writeFile } from 'xlsx';
import { isNotNull } from '@/utils/common';
import { $t } from '@/locales';

export interface ExportExcelProps<T> {
  columns: NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<T>>[];
  data: NaiveUI.TableDataWithIndex<T>[];
  filename: string;
  ignoreKeys?: (keyof NaiveUI.TableDataWithIndex<T> | NaiveUI.CustomColumnKey)[];
  dicts?: Record<keyof NaiveUI.TableDataWithIndex<T>, string>;
}

export function exportExcel<T>({
  columns,
  data,
  filename,
  dicts,
  ignoreKeys = ['index', 'operate']
}: ExportExcelProps<T>) {
  const exportColumns = columns.filter(col => isTableColumnHasKey(col) && !ignoreKeys?.includes(col.key));

  const excelList = data.map(item => exportColumns.map(col => getTableValue(col, item, dicts)));

  const titleList = exportColumns.map(col => (isTableColumnHasTitle(col) && col.title) || null);

  excelList.unshift(titleList);

  const workBook = utils.book_new();

  const workSheet = utils.aoa_to_sheet(excelList);

  workSheet['!cols'] = exportColumns.map(item => ({
    width: Math.round(Number(item.width) / 10 || 20)
  }));

  utils.book_append_sheet(workBook, workSheet, filename);

  writeFile(workBook, `${filename}.xlsx`);
}

function getTableValue<T>(
  col: NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<T>>,
  item: NaiveUI.TableDataWithIndex<T>,
  dicts?: Record<keyof NaiveUI.TableDataWithIndex<T>, string>
) {
  if (!isTableColumnHasKey(col)) {
    return null;
  }

  const { key } = col;

  if (key === 'operate') {
    return null;
  }

  if (isNotNull(dicts?.[key]) && isNotNull(item[key])) {
    return $t(item[key] as App.I18n.I18nKey);
  }

  return item[key];
}

function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

function isTableColumnHasTitle<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> & {
  title: string;
} {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).title);
}
