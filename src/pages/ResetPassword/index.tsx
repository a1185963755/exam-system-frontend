import { useState, useRef } from "react";
import { Form, Input, Button, message, Steps } from "antd";
import { getResetPasswordCode, updatePassword } from "@/api/auth";
import { useNavigate } from "react-router-dom";

interface ResetPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
}

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const timerRef = useRef<number>(0);
  const navigate = useNavigate();

  const startCountdown = () => {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGetVerificationCode = async () => {
    const email = form.getFieldValue("email");
    if (!email) {
      messageApi.error("请先输入邮箱地址");
      return;
    }
    try {
      await getResetPasswordCode(email);
      messageApi.success("验证码已发送到您的邮箱");
      setIsCodeSent(true);
      startCountdown();
    } catch (error) {
      messageApi.error("获取验证码失败，请重试");
    }
  };

  const onFinish = async (values: ResetPasswordForm) => {
    if (currentStep === 0) {
      if (!isCodeSent) {
        messageApi.error("请先获取验证码");
        return;
      }
      setCurrentStep(1);
      // 在下一步中保持已输入的数据
    } else {
      if (values.password !== values.confirmPassword) {
        messageApi.error("两次输入的密码不一致");
        return;
      }
      try {
        const formValues = form.getFieldsValue(true);

        setLoading(true);
        await updatePassword({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          captcha: formValues.captcha,
        });
        form.resetFields();
        clearInterval(timerRef.current);
        setIsCodeSent(false);
        navigate("/login");
        messageApi.success("密码重置成功");
      } catch (error: any) {
        messageApi.error(error.data.message || "密码重置失败，请重试");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">重置密码</h2>
          <Steps
            current={currentStep}
            items={[
              {
                title: "验证邮箱",
              },
              {
                title: "重置密码",
              },
            ]}
          />
          <Form name="resetPassword" form={form} onFinish={onFinish} autoComplete="off" layout="vertical">
            {currentStep === 0 ? (
              <>
                <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
                  <Input placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: "请输入邮箱地址" },
                    { type: "email", message: "请输入有效的邮箱地址" },
                  ]}
                >
                  <Input placeholder="请输入邮箱地址" />
                </Form.Item>

                <Form.Item label="验证码" name="captcha" rules={[{ required: true, message: "请输入验证码" }]}>
                  <div className="flex gap-2">
                    <Input placeholder="请输入验证码" className="flex-1" />
                    <Button type="primary" onClick={handleGetVerificationCode} disabled={countdown > 0} className="whitespace-nowrap">
                      {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                    </Button>
                  </div>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item label="新密码" name="password" rules={[{ required: true, message: "请输入新密码" }]}>
                  <Input.Password placeholder="请输入新密码" />
                </Form.Item>

                <Form.Item label="确认新密码" name="confirmPassword" rules={[{ required: true, message: "请确认新密码" }]}>
                  <Input.Password placeholder="请确认新密码" />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {currentStep === 0 ? "下一步" : "重置密码"}
              </Button>
            </Form.Item>

            <div className="flex justify-end">
              <Button type="link" onClick={() => navigate("/login")}>
                返回登录
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
