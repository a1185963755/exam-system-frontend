import { post, get } from "../utils/request";

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams extends LoginParams {
  email: string;
  captcha: string;
}

// 登录接口
export const login = (params: LoginParams) => {
  return post<{ token: string }>("/login", params);
};

// 注册接口
export const register = (params: RegisterParams) => {
  return post<null>("/register", params);
};

// 获取验证码接口
export const getVerificationCode = (email: string) => {
  return get<null>("/register-captcha", { email });
};
