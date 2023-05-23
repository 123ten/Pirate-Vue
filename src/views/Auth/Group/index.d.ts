interface IColumns {
  title: string;
  dataIndex: string;
  key?: string;
  align: string; // 表格对齐方式 center | left | right
  fixed?: string; // 表头左右固定 left | right
  // responsive?: string[];
  width?: number | string; // 表头宽度

  resizable?: boolean; // 表头是否可伸缩
  minWidth?: number; // 拖动列最小宽度，会受到表格自动调整分配宽度影响
  maxWidth?: number; // 拖动列最大宽度，会受到表格自动调整分配宽度影响
}
interface IDataSource {
  key: string;
  name: string;
  age: number;
  address: string;
  status?: string | number; // 状态 0 禁用 1 启用
  updatetime?: string; // 修改时间
  createTime?: string; // 创建时间
  isDeleteVisible?: boolean; // 是否显示删除气泡
  children?: IDataSource[]; // 设置 children 务必设置 width 否则可能出现宽度浮动
}
