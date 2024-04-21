export type {IColumns, IPages, IPagination, RecordType} from "./table";
export type {FormType, IOptions} from "./form";
export type {CSSPropertiesType} from "./style";
export type {TButtonType} from "./button";

/** 递归回调 */
export type deepCallback<RecordType> = (item: RecordType, index: number, list: RecordType[], parent: RecordType) => void;

/** 递归默认入参
 * @param list 数据
 * @param cb 回调
 * @param children 子级字段 默认children
 * @param parent 父级 默认null
 */
export type deepArguments<RecordType> = [
  list: RecordType[],
  cb?: deepCallback<RecordType>,
  children?: string,
  parent?: RecordType | null,
]
