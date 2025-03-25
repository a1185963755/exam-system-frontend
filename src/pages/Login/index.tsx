import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/auth";

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const response = await login(values);
      localStorage.setItem("token", response.token);
      messageApi.success("登录成功");
      // navigate("/");
    } catch (error: any) {
      messageApi.error(error.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">用户登录</h2>
          <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>

            <div className="flex justify-end">
              <Button type="link" onClick={() => navigate("/register")}>
                注册账号
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
