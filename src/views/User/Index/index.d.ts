interface IDataSource {
  key: string;
  menuname?: string;
  name?: string;
  age: number;
  address: string;
  status?: string | number; // 状态 0 禁用 1 启用
  updatetime?: string; // 修改时间
  createTime?: string; // 创建时间
  isDeleteVisible?: boolean; // 是否显示删除气泡
  children?: IDataSource[]; // 设置 children 务必设置 width 否则可能出现宽度浮动
}
interface ISortTableEnd {
  newIndex: number;
  oldIndex: number;
}

export { IDataSource, ISortTableEnd };
