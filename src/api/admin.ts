import request from "@/utils/request";
import {LoginResult, RefreshResult} from "./types/user";

// 获取管理员头像
export const getAvatar = (params) => {
  return request.get("/admin/avatar", params);
};

// 管理员注册
export const create = (data) => {
  return request.post("/admin/create", data);
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

