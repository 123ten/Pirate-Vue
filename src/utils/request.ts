import axios, {AxiosInstance} from "axios";
import {notification} from "ant-design-vue";
import i18n from "@/locales";
import router from "@/router";
import {setTimeoutPromise} from "@/utils/common";

const {t} = i18n.global;

class AxiosUtils {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      // 根路径
      baseURL: import.meta.env.VITE_BASE_API as string,
      // 请求延迟时间 如果超过这个时间就会断开拦截
      timeout: 10 * 60,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    // 要在constructor里面进行调用 发请求的时候就要开始调用 就要对请求和响应进行拦截
    this.myInterceptors();
  }

  // 拦截器
  // 拦截器要自己定义一个方法.实现拦截
  private myInterceptors() {
    // 封装的是拦截器
    // 请求拦截器
    // 一般的作用是 拦截token或者请求头
    // 添加请求拦截器
    this.http.interceptors.request.use(
        (config: any) => {
          // 在发送请求之前做些什么
          return config;
        },
        (error: any) => {
          // 对请求错误做些什么
          return Promise.reject(error);
        }
    );

    // 添加响应拦截器
    this.http.interceptors.response.use(
        (response: { data: any }) => {
          // 2xx 范围内的状态码都会触发该函数。
          // 对响应数据做点什么
          //对返回的数据进行筛选
          //response.data 只取data中的值,其他的属性不要
          return response.data;
        },
        async (error: any) => {
          const {response} = error;
          const {data} = response;
          // 超出 2xx 范围的状态码都会触发该函数。
          // 对响应错误做点什么
          if (response.status === 401) {
            // 重新登录
            console.log("重新登录", data);
            router.push("/admin/login");
            await setTimeoutPromise(500); // 等待500ms
          }
          // console.log("错误", error, data);
          notification.error({
            message: t("message.fail"),
            description: data.message,
          });
          return Promise.reject(error);
        }
    );
  }

  // 封装一个request方法
  private request(url: string, method: string, data: any = {}) {
    return this.http({
      url,
      method,
      params: method == "get" ? data : null,
      data: method == "post" ? data : null,
    });
  }

  // public公开的,意思就是让别人用  private自己封装的 需要隐藏起来 不让别人用
  // 封装get方法
  public get(url: string, data?: any) {
    return this.request(url, "get", data);
  }

  // 封装post方法
  public post(url: string, data: any) {
    return this.request(url, "post", data);
  }
}

// 新建对象
let http = new AxiosUtils();
// 把对象暴露出去
export default http;
