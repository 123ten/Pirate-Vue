import {FormProps, PaginationProps, TableProps} from "ant-design-vue";
import {FormSearchType, IOptions} from "@/types/form";
import {CSSPropertiesType, TStyle} from "@/types/style";
import {ColumnType} from "ant-design-vue/es/table";
import {DefaultRecordType} from "ant-design-vue/es/vc-table/interface";

type CustomHeaderCellType = {
  style: CSSPropertiesType;
};

// 	设置选择器类型
type DateType = "date" | "week" | "month" | "quarter" | "year";

export interface IColumns<RecordType = DefaultRecordType> extends ColumnType<RecordType> {
  /**
   * key 需要必填
   */
  dataIndex: Required<string>;
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

  /**
   * 设置头部单元格属性
   */
  customHeaderCell?(column: IColumns): CustomHeaderCellType
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

interface I18nPrefix {
  table: string;
  columns: string;
}

export interface ITableProps {
  columns: IColumns[]; // 表格列的配置描述
  dataSource: TableProps['dataSource']; // 数据数组
  rowSelection?: TableProps['rowSelection']; // 表格行是否可选择
  pagination?: TableProps['pagination']; // 指定每页可以显示多少条
  pages?: IPages; // 页码
  formOptions?: FormProps;
  tableOptions?: TableProps;
  size?: TableProps['size']; // 表格大小
  rowKey?: TableProps['rowKey']; // 表格行 key 的取值
  scroll?: TableProps['scroll']; // 设置横向或纵向滚动，也可用于指定滚动区域的宽和高
  i18nPrefix?: I18nPrefix; // 国际化前缀
  childrenColumnName?: TableProps['childrenColumnName']; // 指定树形结构的列名 默认 children
  keywordPlaceholder?: string; // 关键字搜索框 占位内容
  keywordVisible?: boolean; // 是否显示关键字搜索框
  loading?: boolean; // 表格加载状态
  defaultExpandAllRows?: boolean; // 控制展开所有行
  draggable?: boolean; // 是否允许拖拽行 搭配 class drop-row-btn
}
