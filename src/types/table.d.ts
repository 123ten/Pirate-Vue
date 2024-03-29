import {PaginationProps} from "ant-design-vue";
import {IOptions, TypeSearchType} from "@/types/form";
import {TStyle} from "@/types/style";

type TCustomHeaderCell = {
  style: TStyle;
};
// 	设置选择器类型
type TDateType = "date" | "week" | "month" | "quarter" | "year";

interface IColumns {
  type?: TypeSearchType;
  options?: IOptions[];
  title: string;
  dataIndex: string;
  key?: string;
  align?: "center" | "left" | "right"; // 表格对齐方式 center | left | right
  fixed?: "left" | "right"; // 表头左右固定 left | right
  dateType?: TDateType;
  placeholder?: string; // 占位内容
  i18nName?: string; // 国际化
  // responsive?: string[];
  span?: number | string; // 搜索框占位宽度
  width?: number | string; // 表头宽度
  minWidth?: number; // 拖动列最小宽度，会受到表格自动调整分配宽度影响
  maxWidth?: number; // 拖动列最大宽度，会受到表格自动调整分配宽度影响
  style?: TStyle; // 表头样式
  isI18n?: boolean; // 是否开始当前列国际化
  search?: boolean; // 是否允许搜索
  ellipsis?: boolean | { showTitle?: boolean }; // 单元格内容根据宽度自动省略
  hide?: boolean; // 是否隐藏
  resizable?: boolean; // 表头是否可伸缩
  propOptions?: any; // 搜索框配置项
  customCell?(record: any, rowIndex: number, column: IColumns): void; // 设置单元格属性
  customRender?({text, record, index, column}): void;

  customHeaderCell?(column?): TCustomHeaderCell;
}

interface IPages {
  size: number; // 当前页数
  page: number; // 当前页码
  total: number; // 总条数
}

interface IPagination extends PaginationProps {
  pageSizeOptions?: string[];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  pageSize: number;
  current: number;
  total: number;
  // showTotal: (total: number) => unknown;
}

interface IDataSource {
  key: string;
  children?: IDataSource[];
}

export {IColumns, IPages, IPagination, IDataSource};
