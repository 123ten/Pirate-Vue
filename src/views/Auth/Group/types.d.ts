import {TableSettingsType} from "@/types/tableSettingsType";

interface AdminRoleDataSource {
  parentId?: number,
  id?: number,
  path?: string,
  status?: number,
  cache?: number,
  component?: string,
}

interface AdminRoleQueryForm extends AdminRoleDataSource {
}

interface AdminRoleFields extends AdminRoleDataSource {
  description?: string,
  name?: string,
  title?: string,
  icon?: string,
  type?: number,
  frame?: number,
  sort?: number,
}

export type AdminRoleTableSettingsType = TableSettingsType<AdminRoleDataSource, AdminRoleQueryForm, AdminRoleFields>;
