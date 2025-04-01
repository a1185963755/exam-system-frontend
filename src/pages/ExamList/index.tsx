import { useState, useEffect } from "react";
import { Table, Input, Space, Button, Tag, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { examList, deleteExam, publishExam, ExamData, createExam } from "@/api/exam";
import { Form } from "antd";

const ExamList = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [data, setData] = useState<ExamData[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [bin, setBin] = useState(false);

  const fetchExamList = async () => {
    try {
      setLoading(true);
      const response = await examList(bin);
      setData(response);
    } catch (error: any) {
      messageApi.error(error.data?.message || "获取试卷列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamList();
  }, [bin]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    messageApi.success("已退出登录");
    navigate("/login");
    setIsLogoutModalVisible(false);
  };

  const columns: ColumnsType<ExamData> = [
    {
      title: "试卷名称",
      dataIndex: "name",
      key: "name",
      width: 250,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 200,
      render: (createTime: string) => new Date(createTime).toLocaleString(),
    },
    {
      title: "状态",
      dataIndex: "isPublish",
      key: "isPublish",
      width: 100,
      render: (isPublish: boolean) => (isPublish ? <Tag color="green">已发布</Tag> : <Tag color="red">未发布</Tag>),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {!bin && (
            <>
              <Button type="link" onClick={() => handlePublish(record)}>
                {!record.isPublish ? "发布" : "取消发布"}
              </Button>

              <Button type="link" onClick={() => navigate(`/exam/edit/${record.id}`)}>
                编辑
              </Button>
              <Button type="link" onClick={() => navigate(`/exam/paper/${record.id}`)}>
                开始考试
              </Button>
            </>
          )}
          <Button type="link" danger={!bin} onClick={() => handleDelete(record)}>
            {bin ? "恢复" : "删除"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (record: ExamData) => {
    setSelectedExam(record);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedExam) {
      try {
        setLoading(true);
        await deleteExam(Number(selectedExam.id), !bin);
        messageApi.success("操作成功");
        fetchExamList();
      } catch (error: any) {
        messageApi.error(error.data?.message || "操作失败");
      } finally {
        setLoading(false);
      }
    }
    setIsDeleteModalVisible(false);
    setSelectedExam(null);
  };

  const handlePublish = async (record: ExamData) => {
    try {
      setLoading(true);
      await publishExam(record.id, !record.isPublish);
      messageApi.success("操作成功");
      fetchExamList();
    } catch (error: any) {
      messageApi.error(error.data?.message || "操作失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedExam(null);
  };

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      setLoading(true);
      await createExam(values);
      messageApi.success("试卷创建成功");
      setIsAddModalVisible(false);
      addForm.resetFields();
      fetchExamList();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      messageApi.error(error.data?.message || "创建试卷失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {contextHolder}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">试卷列表</h2>
        <div className="flex items-center gap-4">
          <Button type="primary" danger={!bin} onClick={() => setBin((bin) => !bin)}>
            {!bin ? "回收站" : "试卷列表"}
          </Button>
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            新增试卷
          </Button>
          <Input.Search placeholder="搜索试卷名称" allowClear onSearch={(value) => setSearchText(value)} style={{ width: 300 }} />
          <Button type="primary" danger onClick={() => setIsLogoutModalVisible(true)}>
            退出登录
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
        }}
      />
      <Modal title="确认退出" open={isLogoutModalVisible} onOk={handleLogoutConfirm} onCancel={() => setIsLogoutModalVisible(false)}>
        <p>确定要退出登录吗？</p>
      </Modal>
      <Modal title="确认删除" open={isDeleteModalVisible} onOk={handleDeleteConfirm} onCancel={handleDeleteCancel}>
        <p>确定要操作吗？</p>
      </Modal>
      <Modal
        title="新增试卷"
        open={isAddModalVisible}
        onOk={handleAdd}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="name" label="试卷名称" rules={[{ required: true, message: "请输入试卷名称" }]}>
            <Input placeholder="请输入试卷名称" />
          </Form.Item>
          <Form.Item name="content" label="考试内容" rules={[{ required: true, message: "请输入考试内容" }]}>
            <Input.TextArea placeholder="请输入考试内容" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamList;
