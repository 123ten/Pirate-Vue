interface IDataSource {
  key: string;
  updatetime?: string; // 修改时间
  createTime?: string; // 创建时间
}
interface ISortTableEnd {
  newIndex: number;
  oldIndex: number;
}

export { IDataSource, ISortTableEnd };
