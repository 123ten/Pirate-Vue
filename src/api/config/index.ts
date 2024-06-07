// 配置文件
import request from "@/utils/request";

// 数据库配置
export const configDatabase = (data) => {
  return request.post("/config/database", data);
};

