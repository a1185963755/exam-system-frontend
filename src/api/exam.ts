import { post, get } from "../utils/request";

export interface ExamData {
  id: number;
  name: string;
  isPublish: boolean;
  isDelete: boolean;
  content: string;
  createTime: string;
  updateTime: string;
  creatorId: number;
}

// 考试列表
export const examList = (bin: boolean) => {
  return get<ExamData[]>("exam/list", { bin });
};

// 试卷详情
export const findExam = (id: number) => {
  return get<ExamData>("exam/find/" + id);
};

// 创建试卷
export const createExam = (data: any) => {
  return post<null>("exam/create", data);
};

// 删除试卷
export const deleteExam = (id: number, isDelete: boolean) => {
  return post<null>("exam/delete", { id, isDelete });
};

// 保存试卷
export const saveExam = (data: any) => {
  return post<null>("exam/save", data);
};

// 发布试卷
export const publishExam = (id: number, isPublish: boolean) => {
  return post<null>("exam/publish", { id, isPublish });
};
