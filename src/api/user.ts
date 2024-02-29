import request from "@/utils/request";

// 获取用户头像
export const getAvatar = (params) => {
  return request.get("/user/avatar", params);
};

// 获取图形验证码
export const getSvgCaptcha = () => {
  return request.get("/user/svg-captcha");
};

// 用户登录
export const login = (data) => {
  return request.post("/user/login", data);
};
