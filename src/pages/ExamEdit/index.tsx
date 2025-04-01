import { useEffect, useState } from "react";
import { Form, Input, Button, Select, InputNumber, Space, Card, message, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { findExam, saveExam } from "@/api/exam";
import { MateriaItem } from "./Materia";
import { useDrop } from "react-dnd";

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

const ExamEdit = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { id } = useParams();

  const questionTypes = [
    { label: "单选题", value: "单选题" },
    { label: "多选题", value: "多选题" },
    { label: "判断题", value: "判断题" },
  ];
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: questionTypes.map((q) => q.value),
    drop: (item: Question) => {
      addQuestion(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      content: "",
      options: [],
      score: 0,
      answer: "",
      analysis: "",
    };
    if (type === "判断题") {
      newQuestion.answer = "true";
    }
    setQuestions((questions) => [...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)));
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...q.options, { content: "", isCorrect: false }],
            }
          : q
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) {
          return q;
        }
        let answer = q.answer;
        if (q.type === "单选题" && field === "isCorrect") {
          answer = optionIndex.toString();
        }
        if (q.type === "多选题" && field === "isCorrect") {
          const selectedOptions = q.options
            .map((opt, idx) => (idx === optionIndex ? { ...opt, [field]: value } : opt))
            .reduce((acc, opt, idx) => (opt.isCorrect ? [...acc, idx.toString()] : acc), []);
          answer = selectedOptions.join(",");
        }
        return {
          ...q,
          options: q.options.map((opt, idx) => {
            if (field === "isCorrect" && q.type === "单选题") {
              const isCurrentOption = idx === optionIndex;
              return { ...opt, isCorrect: isCurrentOption };
            }
            return idx === optionIndex ? { ...opt, [field]: value } : opt;
          }),
          answer,
        };
      })
    );
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, idx) => idx !== optionIndex),
            }
          : q
      )
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveExam({
        id: Number(id),
        content: JSON.stringify(questions),
      });
      messageApi.success("保存成功");
    } catch (error: any) {
      messageApi.error(error.data?.message || "保存失败");
    } finally {
      setLoading(false);
    }
  };

  const getExamData = async (id: number) => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const data = await findExam(id);
      if (data.content === "") {
        return;
      }
      setQuestions(() => JSON.parse(data.content));
    } catch (error: any) {
      messageApi.error(error.data?.message || "获取考试详情失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExamData(Number(id));
  }, [id]);

  return (
    <div className="p-6">
      {contextHolder}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">编辑试卷</h2>
        <Space>
          <Button onClick={() => navigate("/")}>返回</Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            保存
          </Button>
        </Space>
      </div>

      <div className="flex gap-4">
        <div className="w-48 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">题型</h3>
          <Space direction="vertical" className="w-full">
            {questionTypes.map((type) => (
              <MateriaItem key={type.value} name={type.label} type={type.value} />
            ))}
          </Space>
        </div>
        <div className="flex-1 " ref={dropRef} style={isOver ? { border: "2px solid blue" } : {}}>
          <Space direction="vertical" className="w-full">
            {questions.map((question) => (
              <Card
                title={question.type}
                key={question.id}
                className="w-full"
                extra={
                  <Button type="text" danger onClick={() => removeQuestion(question.id)}>
                    删除
                  </Button>
                }
              >
                <Space direction="vertical" className="w-full">
                  <Input.TextArea
                    placeholder="请输入题目内容"
                    value={question.content}
                    onChange={(e) => updateQuestion(question.id, "content", e.target.value)}
                    rows={2}
                  />

                  <div className="pl-8">
                    {question.options.map((option, index) => (
                      <Space key={index} className="mb-2" align="start">
                        <Form.Item valuePropName="checked" className="mb-0">
                          {question.type === "单选题" ? (
                            <input
                              type="radio"
                              checked={option.isCorrect}
                              onChange={(e) => {
                                updateOption(question.id, index, "isCorrect", e.target.checked);
                              }}
                              name={`question-${question.id}`}
                            />
                          ) : question.type === "多选题" ? (
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => {
                                updateOption(question.id, index, "isCorrect", e.target.checked);
                              }}
                            />
                          ) : null}
                        </Form.Item>
                        <Input
                          placeholder="请输入选项内容"
                          value={option.content}
                          onChange={(e) => updateOption(question.id, index, "content", e.target.value)}
                        />
                        <Button type="text" danger onClick={() => removeOption(question.id, index)}>
                          删除
                        </Button>
                      </Space>
                    ))}
                    {question.type !== "判断题" ? (
                      <Button type="dashed" onClick={() => addOption(question.id)} block className="mt-2">
                        添加选项
                      </Button>
                    ) : (
                      <>
                        <span className="mr-4">答案</span>
                        <Select
                          defaultValue="true"
                          onChange={(val) => updateQuestion(question.id, "answer", val)}
                          options={[
                            { value: "true", label: "对" },
                            { value: "false", label: "错" },
                          ]}
                        />
                      </>
                    )}
                  </div>

                  <Space className="w-full">
                    <InputNumber
                      placeholder="分值"
                      value={question.score}
                      onChange={(value) => updateQuestion(question.id, "score", value)}
                      min={0}
                      className="w-24"
                    />
                    <Input
                      placeholder="答案解析"
                      value={question.analysis}
                      onChange={(e) => updateQuestion(question.id, "analysis", e.target.value)}
                      className="flex-1"
                    />
                  </Space>
                </Space>
              </Card>
            ))}
          </Space>
        </div>
        {/* 试卷预览 */}
        <div className="w-96 bg-white p-4 rounded shadow">
          <Tabs
            defaultActiveKey="preview"
            items={[
              {
                key: "preview",
                label: "试卷预览",
                children: (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="w-full">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-bold">{`${index + 1}. ${question.type}`}</span>
                            <span className="text-blue-500">{`(${question.score}分)`}</span>
                          </div>
                          <div>{question.content}</div>
                          {question.type !== "判断题" ? (
                            <div className="pl-4 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  {question.type === "单选题" ? (
                                    <input type="radio" disabled checked={option.isCorrect} />
                                  ) : (
                                    <input type="checkbox" disabled checked={option.isCorrect} />
                                  )}
                                  <span>{option.content}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="pl-4 flex items-center gap-4">
                              <label className="flex items-center gap-1">
                                <input type="radio" disabled checked={question.answer === "true"} />
                                <span>正确</span>
                              </label>
                              <label className="flex items-center gap-1">
                                <input type="radio" disabled checked={question.answer === "false"} />
                                <span>错误</span>
                              </label>
                            </div>
                          )}
                          {question.analysis && (
                            <div className="text-gray-500">
                              <span className="font-bold">解析：</span>
                              {question.analysis}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ),
              },
              {
                key: "json",
                label: "JSON数据",
                children: (
                  <div className="space-y-4">
                    <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 rounded">{JSON.stringify(questions, null, 2)}</pre>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamEdit;
