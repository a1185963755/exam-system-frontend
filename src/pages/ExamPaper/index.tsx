import { useState, useEffect } from "react";
import { Card, Space, Button, Radio, Checkbox, message, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { findExam } from "@/api/exam";

interface QuestionOption {
  content: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: string;
  content: string;
  options: QuestionOption[];
  score: number;
  answer: string;
  analysis: string;
}

const ExamPaper = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // 用户答案
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [timeLeft, setTimeLeft] = useState(7200); // 默认2小时考试时间
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getExamData(Number(id));
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getExamData = async (id: number) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await findExam(id);
      if (data.content === "") return;
      setQuestions(JSON.parse(data.content));
    } catch (error: any) {
      messageApi.error(error.data?.message || "获取试卷失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // TODO: 实现答案自动保存
  };

  const handleSubmit = () => {
    // TODO: 实现试卷提交和成绩计算
    messageApi.success("试卷提交成功");
    navigate("/");
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6">
      {contextHolder}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">考试中</h2>
        <Space>
          <div className="text-lg">
            剩余时间：<span className="text-red-500 font-bold">{formatTime(timeLeft)}</span>
          </div>
          <Button type="primary" danger onClick={() => setIsSubmitModalVisible(true)}>
            交卷
          </Button>
        </Space>
      </div>

      <div className="flex gap-4">
        {/* 左侧题目导航 */}
        <div className="w-48 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">题目导航</h3>
          <Space direction="vertical" className="w-full">
            {questions.map((question, index) => (
              <Button
                key={question.id}
                type={answers[question.id] ? "primary" : "default"}
                block
                onClick={() => document.getElementById(question.id)?.scrollIntoView({ behavior: "smooth" })}
              >
                第{index + 1}题
              </Button>
            ))}
          </Space>
        </div>

        {/* 右侧答题区域 */}
        <div className="flex-1">
          <Space direction="vertical" className="w-full">
            {questions.map((question, index) => (
              <Card id={question.id} key={question.id} title={`${index + 1}. ${question.type} (${question.score}分)`} className="w-full">
                <div className="space-y-4">
                  <div>{question.content}</div>
                  {question.type === "判断题" ? (
                    <Radio.Group value={answers[question.id]} onChange={(e) => handleAnswerChange(question.id, e.target.value)}>
                      <Space direction="vertical">
                        <Radio value="true">正确</Radio>
                        <Radio value="false">错误</Radio>
                      </Space>
                    </Radio.Group>
                  ) : question.type === "单选题" ? (
                    <Radio.Group value={answers[question.id]} onChange={(e) => handleAnswerChange(question.id, e.target.value)}>
                      <Space direction="vertical">
                        {question.options.map((option, optIndex) => (
                          <Radio key={optIndex} value={optIndex.toString()}>
                            {option.content}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  ) : (
                    <Checkbox.Group
                      value={answers[question.id]?.split(",") || []}
                      onChange={(values) => handleAnswerChange(question.id, values.join(","))}
                    >
                      <Space direction="vertical">
                        {question.options.map((option, optIndex) => (
                          <Checkbox key={optIndex} value={optIndex.toString()}>
                            {option.content}
                          </Checkbox>
                        ))}
                      </Space>
                    </Checkbox.Group>
                  )}
                </div>
              </Card>
            ))}
          </Space>
        </div>
      </div>

      <Modal title="确认提交" open={isSubmitModalVisible} onOk={handleSubmit} onCancel={() => setIsSubmitModalVisible(false)}>
        <p>确定要提交试卷吗？提交后将无法修改答案。</p>
      </Modal>
    </div>
  );
};

export default ExamPaper;
