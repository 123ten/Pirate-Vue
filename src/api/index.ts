import request from "@/utils/request";

export const api_login = (data: any) => {
  return request.post("/users/checkLogin", data);
};
