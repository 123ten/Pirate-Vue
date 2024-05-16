import {IColumns, IPages, ITableProps} from "@/types/table";
import {DefaultRecordType} from "ant-design-vue/es/vc-table/interface";
import {Key} from "ant-design-vue/lib/table/interface";
import {type Ref, UnwrapNestedRefs} from "vue";
import {FormInstance, FormProps, PaginationProps} from "ant-design-vue";
import {Props, ValidateInfo, validateOptions,} from "ant-design-vue/lib/form/useForm";
import type {RuleError} from "ant-design-vue/lib/form/interface";
import {Rules} from "@/types/form";
import {IModalProps} from "@/components/IComponents/IModal/types";

/**
 * 表示操作按钮或操作类型的枚举。
 * @typedef {('refresh' | 'delete' | 'create' | 'expand' | 'row-detail' | 'row-update' | 'row-delete')} Operation
 */
export declare type Operation =
  | "refresh"
  | "delete"
  | "create"
  | "expand"
  | 'row-sortable'
  | "row-detail"
  | "row-update"
  | "row-delete";

/**
 * 自定义 params 入参
 */
export declare type CustomParamsKey = "queryAll" | "confirmForm";

export declare type DefaultQueryFormType = Record<string, any> | undefined;

export declare type DefaultFieldsType = {
  id?: Key;
};

export interface PrivateApi {
  request: Function;
  deleteRequest: Function;
  detailRequest: Function;
  upsertRequest: Function;
}

export interface TableReactive<
  RecordType = DefaultRecordType,
  QueryForm = DefaultQueryFormType
> {
  /** 表格列配置 */
  columns?: IColumns<RecordType>[];
  /** 查询表单数据 */
  dataSource?: RecordType[];
  /** 操作按钮 */
  operations?: Operation[];
  /** 选中的行 */
  selectedRowKeys?: Key[];
  /** 分页信息 */
  pages?: IPages;
  /** 分页配置 */
  pagination?: PaginationProps;
  /** 查询表单 */
  queryForm?: QueryForm;
  /** 国际化前缀 */
  i18nPrefix?: ITableProps["i18nPrefix"];
  /** 表格行 key 的取值 */
  rowKey?: string;
  /** 表格备注 */
  remark?: string;
  /** 表单布局 */
  defaultSpan?: number;
  /** 表格 loading */
  loading?: boolean;
  /** 初始时，是否展开所有行 */
  defaultExpandAllRows?: boolean;
  /** 控制表格字段下的 form-modal 对话框的可见性，默认为 true */
  fieldModalVisible?: boolean;
}

export interface FormReactive<Fields = DefaultFieldsType> {
  /** 表单数据对象 */
  fields: Fields;
  /** 表单配置 */
  formConfig?: FormProps;
  /** 表单验证规则 */
  rules?: Rules;
  /** 表单名称，会作为表单字段 id 前缀使用 */
  name?: string;
  /** 表单布局 */
  defaultSpan?: number;
  /** 表单弹窗配置 */
  modal: IModalProps;
}

export interface InfoReactive<Fields = DefaultFieldsType> {
  /** 表单数据对象 */
  fields: Fields;
  /** 表单布局 */
  defaultSpan?: number;
  /** 表单弹窗配置 */
  modal: IModalProps;
}


/**
 * 对话框
 */
export interface ModalReactive extends IModalProps {
  visible?: boolean;
}

declare type namesType = string | string[];

/**
 * 表单 ref
 */
export interface FormRefs
  extends Pick<FormInstance, "validate" | "resetFields"> {
  modelRef: Props | Ref<Props>;
  rulesRef: Props | Ref<Props>;
  initialModel: Props;
  validateInfos: validateInfos;
  resetFields: (newValues?: Props) => void;
  validate: <T = any>(
    names?: namesType,
    option?: validateOptions
  ) => Promise<T>;
  /** This is an internal usage. Do not use in your prod */
  validateField: (
    name: string,
    value: any,
    rules: Record<string, unknown>[],
    option?: validateOptions
  ) => Promise<RuleError[]>;
  mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
  clearValidate: (names?: namesType) => void;
}

export declare interface TableSettingsType<
  RecordType = DefaultRecordType,
  QueryForm = DefaultQueryFormType,
  Fields = DefaultFieldsType
> {
  _api?: PrivateApi;

  readonly table: UnwrapNestedRefs<TableReactive<RecordType, QueryForm>>;

  readonly form: UnwrapNestedRefs<FormReactive<Fields>>;

  /**
   * 表单数据对象
   */
  readonly info: UnwrapNestedRefs<InfoReactive<Fields>>;

  /**
   * 公共 modal 配置
   */
  readonly modal: UnwrapNestedRefs<ModalReactive>

  formRefs?: FormRefs;

  customParams?: Record<CustomParamsKey, Function>;

  /**
   * 表格数据查询
   */
  queryAll(): Promise<void> | void;

  /**
   * 删除数据
   * @param type {string} delete 表格头部多选删除 row-delete 单行数据杉删除
   * @param ids {(string | number)[]}
   */
  deleteByIds(
    type: Extract<Operation, "delete" | "row-delete">,
    ids: Key[]
  ): Promise<void> | void;

  /**
   * 获取详情接口
   * @param id {(string | number)[]}
   * @param success {Function}
   */
  detailById(id: Key, success?: Function): Promise<void> | void;

  /**
   * 分页
   * @param pages {page: number, size: number, total: number}
   */
  pagesChange(pages: IPages): Promise<void> | void;

  /**
   * 表格选择
   * @param selectedRowKeys {(string | number)[]}
   */
  selectChange(selectedRowKeys: Key[]): Promise<void> | void;

  /**
   * 打开表单弹窗
   * @param type {0 | 1}0 新增 1 编辑
   * @param id {(string | number)[]}
   * @param success {Function}
   */
  openForm(type: 0 | 1, id?: Key, success?: Function): Promise<void> | void;

  /**
   * 关闭表单
   */
  cancelForm(): Promise<void> | void;

  /**
   * 确认表单
   */
  confirmForm(): Promise<void> | void;

  /**
   * 打开详情弹窗
   * @param id {(string | number)[]}
   * @param success {Function}
   */
  openDetail(id: Key, success?: Function): Promise<void> | void;

  /**
   * 功能接口 转换 queryParams 为接口所需要的数据
   */
  transformParams(): QueryForm | undefined;
}
