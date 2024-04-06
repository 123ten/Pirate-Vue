import {PaginationProps} from "ant-design-vue";
import {FormSearchType, IOptions} from "@/types/form";
import {TStyle} from "@/types/style";
import {ColumnType} from "ant-design-vue/es/table";

type TCustomHeaderCell = {
  style: TStyle;
};
// 	设置选择器类型
type DateType = "date" | "week" | "month" | "quarter" | "year";

export interface IColumns extends ColumnType {
  /**
   * 表格搜索内容类型
   */
  type?: FormSearchType;
  /**
   * select/radio/tree 选择项
   */
  options?: IOptions[];
  /**
   * 日期格式
   */
  dateType?: DateType;
  /**
   * 占位内容
   */
  placeholder?: string;
  /**
   * 国际化
   */
  i18nName?: string;
  // responsive?: string[];
  /**
   * 搜索框占位宽度
   */
  span?: number | string;
  /**
   * 表头宽度
   */
  width?: number | string;
  /**
   * 拖动列最小宽度，会受到表格自动调整分配宽度影响
   */
  minWidth?: number;
  /**
   * 拖动列最大宽度，会受到表格自动调整分配宽度影响
   */
  maxWidth?: number;
  /**
   * 表头样式
   */
  style?: TStyle;
  /**
   * 是否开始当前列国际化
   */
  isI18n?: boolean;
  /**
   * 是否允许搜索
   */
  search?: boolean;
  /**
   * 单元格内容根据宽度自动省略
   */
  ellipsis?: boolean | { showTitle?: boolean };
  /**
   * 是否隐藏
   */
  hide?: boolean;
  /**
   * 表头是否可伸缩
   */
  resizable?: boolean;
  /**
   * 搜索框配置项
   */
  propOptions?: any;
}

/**
 * 接口分页参数
 */
export interface IPages {
  /**
   * 当前页
   */
  size: number;
  /**
   * 当前页码
   */
  page: number;
  /**
   * 总条数
   */
  total: number;
}

/**
 * 分页参数
 */
export type IPagination = PaginationProps

export interface IDataSource {
  key: string;
  children?: IDataSource[];
}
