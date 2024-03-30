import request from "@/utils/request";
import {LoginResult, RefreshResult} from "./types/user";

// 获取管理员头像
export const getAvatar = (params) => {
  return request.get("/admin/avatar", params);
};

// 管理员注册/编辑
export const upsert = (data) => {
  return request.post("/admin/upsert", data);
};

// 管理员登录
export const login = (data): Promise<LoginResult> => {
  return request.post("/admin/login", data);
};

// 获取管理员列表
export const getAdminList = (params) => {
  return request.get("/admin/list", params);
};

// 刷新access_token
export const refresh = (params): Promise<RefreshResult> => {
  return request.get("/admin/refresh", params);
}

// 分页获取角色列表
export const getRoleList = (params) => {
  return request.get("/admin/roles", params);
};

// 删除管理员
export const remove = (data) => {
  return request.post("/admin/remove", data);
};

// 获取管理员信息
export const detail = (id: number) => {
  return request.get("/admin/detail/" + id);
};

// 获取管理员菜单列表
export const getMenuList = (params) => {
  return request.get("/admin/menus", params);
};

// 新增/修改菜单
export const upsertMenu = (data) => {
  return request.post("/admin/menu/upsert", data);
}

// 删除菜单
export const removeMenu = (data) => {
  return request.post("/admin/menu/remove", data);
}

// 获取菜单详情
export const menuDetail = (id: number) => {
  return request.get("/admin/menu/detail/" + id);
}



