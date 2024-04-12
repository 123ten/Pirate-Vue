import {DefaultStatus, DefaultTableState, type RecordType} from "@/types/table";

export interface AdminDataSource extends RecordType {
  /** 登录用户名 */
  username?: string
  /** 昵称 */
  nickname?: string
  /** 头像 */
  avatar?: string
  /** 头像路径 */
  avatarPath?: string;
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 状态 0 禁用 1 启用 */
  status?: DefaultStatus
  /** 角色组 */
  roles?: string;
  /** 最后一次登录id */
  lastLoginIp?: string;
  /** 最后一次登录时间 */
  lastLoginTime?: string;
}

export interface AdminDetailInfo extends AdminDataSource {
  /** 角色组 */
  roleIds?: []
  /** 密码 */
  password?: string
  /** 角色组 */
  fileList?: any[]
}

export interface AdminState extends DefaultTableState<AdminDataSource> {
  /** 详情数据 */
  formState: AdminDetailInfo;
  /** modal加载 */
  isModalLoading: boolean;
}
