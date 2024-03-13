import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {notification} from "ant-design-vue";
import i18n from "@/locales";
import {setTimeoutPromise} from "@/utils/common";
import {refresh} from "@/api/user";
import {$local} from "@/utils/storage";
import {RefreshResult} from "@/api/types/user";

const {t} = i18n.global;


interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function
}

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
      },
    });
    // 要在constructor里面进行调用 发请求的时候就要开始调用 就要对请求和响应进行拦截
    this.interceptors();
  }

  /**
   * @description 刷新 accessToken
   * @private
   */
  private async refreshAccessToken(): Promise<RefreshResult> {
    const refreshToken = $local.get("refreshToken");
    const {data, code} = await refresh({refreshToken});

    console.log('refresh', code, data);
    $local.set("accessToken", data.accessToken);
    $local.set("refreshToken", data.refreshToken);
    return {data, code}
  }

  // 拦截器
  private interceptors() {

    let refreshing: boolean = false;
    const subscribers: PendingTask[] = [];

    // 请求拦截器
    this.http.interceptors.request.use(
        (config: any) => {
          // 在发送请求之前做些什么
          const accessToken = $local.get('accessToken');

          if (accessToken) {
            config.headers.Authorization = "Bearer " + $local.get("accessToken"); // 一定要放在请求头里面
          }
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
          const {data, config} = response;

          if (refreshing) {
            return new Promise((resolve) => {
              subscribers.push({config, resolve});
            })
          }

          // 超出 2xx 范围的状态码都会触发该函数。
          // 对响应错误做点什么
          if (response.status === 401 && !config.url.includes('/user/refresh')) {
            refreshing = true;
            const {code, data} = await this.refreshAccessToken()
            refreshing = false;

            console.log('config', code, config)
            if (code === 200) {
              subscribers.forEach(({config, resolve}) => {
                resolve(this.http(config))
              });

              // config.headers.Authorization = "Bearer " + data.accessToken;
              return this.http(config);
            }
            // 重新登录
            console.log("重新登录", data, config);
            // router.push("/admin/login");
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
  };

  // 封装一个request方法
  private request(url: string, method: string, data: any = {}) {
    return this.http({
      url,
      method,
      params: method == "get" ? data : null,
      data: method == "post" ? data : null,
    });
  };

  // 封装get方法
  public get(url: string, data?: any) {
    return this.request(url, "get", data);
  };

  // 封装post方法
  public post(url: string, data: any) {
    return this.request(url, "post", data);
  };
}

// 新建对象
const http = new AxiosUtils();
// 把对象暴露出去
export default http;
