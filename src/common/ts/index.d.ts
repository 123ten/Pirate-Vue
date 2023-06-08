interface IColumns {
  title: string;
  dataIndex: string;
  key?: string;
  align?: string; // 表格对齐方式 center | left | right
  fixed?: string; // 表头左右固定 left | right
  // responsive?: string[];
  width?: number | string; // 表头宽度
  resizable?: boolean; // 表头是否可伸缩
  minWidth?: number; // 拖动列最小宽度，会受到表格自动调整分配宽度影响
  maxWidth?: number; // 拖动列最大宽度，会受到表格自动调整分配宽度影响
  customCell?(record: IDataSource, rowIndex: number, column: IColumns); // 设置单元格属性
  customRender?({ text, record, index, column });
}

interface IPagination {
  current: number;
  pageSize: number;
  pageSizeOptions: string[];
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  total: number;
}

interface IPages {
  pageSize: number; // 当前页数
  current: number; // 当前页码
  total: number; // 总条数
}

export { IColumns, IPages, IPagination };
