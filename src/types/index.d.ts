type TypeSearchType = "input" | "select" | "radio";
interface IOptions<T> {
  label: string;
  value: T<value>;
}
interface IColumns {
  type?: TypeSearchType;
  options?: IOptions;
  title: string;
  dataIndex: string;
  key?: string;
  align?: string; // 表格对齐方式 center | left | right
  fixed?: string; // 表头左右固定 left | right
  placeholder?: string; // 占位内容
  // responsive?: string[];
  span?: number | string; // 搜索框占位宽度
  width?: number | string; // 表头宽度
  minWidth?: number; // 拖动列最小宽度，会受到表格自动调整分配宽度影响
  maxWidth?: number; // 拖动列最大宽度，会受到表格自动调整分配宽度影响
  search?: boolean; // 是否允许搜索
  resizable?: boolean; // 表头是否可伸缩
  customCell?(record: any, rowIndex: number, column: IColumns): void; // 设置单元格属性
  customRender?({ text, record, index, column }): void;
}

interface IPages {
  pageSize: number; // 当前页数
  current: number; // 当前页码
  total: number; // 总条数
}

interface IPagination extends IPages {
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  // showTotal: (total: number) => unknown;
}

export { IColumns, IPages, IPagination };
