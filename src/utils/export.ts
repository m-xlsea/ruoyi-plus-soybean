import { utils, writeFile } from 'xlsx';
import { isNotNull } from '@/utils/common';
import { $t } from '@/locales';

export interface ExportExcelProps<T> {
  columns: NaiveUI.TableColumn<T>[];
  data: T[];
  filename: string;
  ignoreKeys?: (keyof T | (string & {}))[];
  dicts?: Record<keyof T, string>;
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

function getTableValue<T>(col: NaiveUI.TableColumn<T>, item: T, dicts?: Record<keyof T, string>) {
  if (!isTableColumnHasKey(col)) {
    return null;
  }

  const { key } = col;

  if (key === 'operate') {
    return null;
  }

  if (isNotNull(dicts?.[key as keyof T]) && isNotNull(item[key as keyof T])) {
    return $t(item[key as keyof T] as App.I18n.I18nKey);
  }

  return item[key as keyof T];
}

function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

function isTableColumnHasTitle<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> & {
  title: string;
} {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).title);
}
