/** The common type namespace */
declare namespace CommonType {
  /** The strategic pattern */
  interface StrategicPattern {
    /** The condition */
    condition: boolean;
    /** If the condition is true, then call the action function */
    callback: () => void;
  }

  /**
   * The option type
   *
   * @property value: The option value
   * @property label: The option label
   */
  type Option<K = string> = { value: K; label: string };

  /** The record type */
  type Record<K extends string | number = string> = { [key in K]: string };

  type YesOrNo = 'Y' | 'N';

  /** add null to all properties */
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | null;
  };

  /** The id type */
  type IdType = string | number;

  /** The res error code */
  type ErrorCode = '401' | '403' | '404' | 'default';

  /** 构造树型结构数据的配置选项 */
  type TreeConfig = {
    /** id字段名 */
    idField: string;
    /** 父节点字段名 */
    parentIdField?: string;
    /** 子节点字段名 */
    childrenField?: string;
    /** 过滤函数 */
    filterFn?: (node: any) => boolean;
  };
}
