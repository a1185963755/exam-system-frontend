import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    message.error("请求发送失败");
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    if (data.code === 200) {
      return data.data;
    } else {
      message.error(data.message || "请求失败");
      return Promise.reject(new Error(data.message || "请求失败"));
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error("未授权，请重新登录");
          // 可以在这里处理登出逻辑
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          message.error("拒绝访问");
          break;
        case 404:
          message.error("请求错误，未找到该资源");
          break;
        case 500:
          message.error("服务器错误");
          break;
        default:
          message.error(`连接错误${error.response.status}`);
      }
    } else {
      message.error("网络连接异常，请稍后重试");
    }
    return Promise.reject(error.response || "Error");
  }
);

// 封装GET请求
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, { params, ...config });
};

// 封装POST请求
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config);
};

// 封装PUT请求
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config);
};

// 封装DELETE请求
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config);
};

export default request;
