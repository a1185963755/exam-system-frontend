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
  return post<{ token: string }>("user/login", params);
};

// 注册接口
export const register = (params: RegisterParams) => {
  return post<null>("user/register", params);
};

// 获取验证码接口
export const getVerificationCode = (email: string) => {
  return get<null>("user/register-captcha", { email });
};

// 获取重置密码验证码接口
export const getResetPasswordCode = (email: string) => {
  return get<null>("user/update_password-captcha", { email });
};

// 重置密码接口
export const updatePassword = (params: { username: string; email: string; password: string; captcha: string }) => {
  return post<null>("user/update-password", params);
};
