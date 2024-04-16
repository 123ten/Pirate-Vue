import {DefaultTableState, type RecordType} from "@/types/table";
import {DateRangeTuple} from "@/types/form";

export interface RoutineAnnexDataSource extends RecordType {
  username?: string; // 用户名
  usertype?: string; // 用户类型 1 管理员 2 普通用户
  size?: string; // 文件大小
  mimetype?: string; // 文件类型
  full_url?: string; // 完整路径
  upload_count?: string; // 上传次数
  filename?: string; // 原始名称
}

export interface RoutineAnnexFormState extends RoutineAnnexDataSource {
  parentId?: number; // 父级ID
  path?: string; // 路由
  frame?: number; // 1 选项卡 2 外链 3 iframe
  description?: string; // 描述
}

interface QueryFormType {
  name?: string;
  username?: string;
  usertype?: number;
  mimetype?: string;
  filename?: string;
  createRange?: DateRangeTuple
  updateRange?: DateRangeTuple
}

export interface RoutineAnnexStoreState extends DefaultTableState<RoutineAnnexStoreDataSource, QueryFormType> {
  /** 详情数据 */
  formState: RoutineAnnexFormState;
  /** modal加载 */
  isModalLoading: boolean;
}
