import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {notification} from "ant-design-vue";
import i18n from "@/locales";
import {setTimeoutPromise} from "@/utils/common";
import {refresh} from "@/api/user";
import {$local} from "@/utils/storage";
import {RefreshResult} from "@/api/types/user";
import router from "@/router";

const {t} = i18n.global;

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function
}

class AxiosUtils {
  private readonly http: AxiosInstance;
  private refreshing: boolean = false;
  private readonly subscribers: PendingTask[] = [];

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_BASE_API,
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
    // 请求拦截器
    this.http.interceptors.request.use(
        this.requestSuccessHandler.bind(this),
        this.requestErrorHandler.bind(this)
    );
    // 响应拦截器
    this.http.interceptors.response.use(
        this.responseSuccessHandler.bind(this),
        this.responseErrorHandler.bind(this)
    );
  };

  /**
   * @description 移除重复请求
   * @param config
   * @private
   */
  private removePending(config: AxiosRequestConfig) {
    for (let p in this.subscribers) {
      let s = this.subscribers[p];
      if (s.config.url === config.url) {
        this.subscribers.splice(Number(p), 1);
      }
    }
  }

  /**
   * @description 请求成功处理
   * @param config
   * @private
   */
  private requestSuccessHandler(config: any) {
    // 在发送请求之前做些什么
    const accessToken = $local.get('accessToken');

    if (accessToken) {
      config.headers.Authorization = "Bearer " + $local.get("accessToken"); // 一定要放在请求拦截器里
    }
    return config;
  }

  /**
   * @description 请求错误处理
   * @param error
   * @private
   */
  private requestErrorHandler(error: any) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }

  /**
   * @description 响应成功处理 2xx 范围内的状态码都会触发该函数。
   * @param response
   * @private
   */
  private responseSuccessHandler(response: any) {
    return response.data;
  }

  /**
   * @description 响应错误处理 超出 2xx 范围的状态码都会触发该函数。
   * @param error
   * @private
   */
  private async responseErrorHandler(error: any) {
    const {response} = error;
    const {data, config} = response;

    if (response.status === 401 && config.url.includes('/user/refresh')) {
      await this.unAuthorizedHandler(response);
      return Promise.reject(error);
    }

    if (this.refreshing) {
      return new Promise((resolve) => {
        this.subscribers.push({config, resolve});
      })
    }

    if (response.status === 401 && !config.url.includes('/user/refresh')) {
      this.refreshing = true;
      console.log(config.url)
      const {code, data} = await this.refreshAccessToken();
      this.refreshing = false;

      if (code === 200) {
        this.subscribers.forEach(({config, resolve}) => {
          resolve(this.http(config))
        });

        return this.http(config);
      }
      // console.log("重新登录", data, config);
      await this.unAuthorizedHandler(response)
    }
    // console.log("错误", error, data);
    notification.error({
      message: t("message.fail"),
      description: data.message,
    });
    return Promise.reject(error);
  }

  /**
   * @description 重新登录处理
   * @param response
   * @private
   */
  private async unAuthorizedHandler(response: any) {
    // 重新登录
    router.push("/admin/login");
    this.refreshing = false; // 重置刷新状态
    this.subscribers.length = 0; // 清空请求队列
    await setTimeoutPromise(500); // 等待500ms
    notification.error({
      message: t("message.fail"),
      description: t("message.loginExpired"),
    });
  }

  // 封装一个request方法
  private request(url: string, method: string, data: any = {}) {
    return this.http({
      url,
      method,
      params: method == "get" ? data : undefined,
      data: method == "post" ? data : undefined,
    });
  };

  // 封装get方法
  public get(url: string, params?: any) {
    return this.request(url, "get", params);
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
