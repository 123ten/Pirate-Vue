import {DefaultTableState, type RecordType} from "@/types/table";

export interface AdminLogDataSource extends RecordType {
  userId?: number;
  username?: string;
  title?: string;
  method?: string
  ip?: string
  url?: string
  userAgent?: string
}

export interface AdminLogDetailInfo extends AdminLogDataSource {
  params?: string;
  result?: string;
  status?: number;
  responseTime?: number
}

export interface AdminLogStoreState extends DefaultTableState<AdminLogStoreDataSource> {
  /** 详情数据 */
  detailInfo: AdminLogDetailInfo;
  /** 详情加载 */
  isDetailModalLoading: boolean;
}
