import { post, get } from "../utils/request";
type AnswerResultType = {
  id: number;
  content: string;
  score: number;
  createTime: string;
  updateTime: string;
  answererId: number;
  examId: number;
};

// 新建答卷
export const addAnswer = (examId: string, content: Record<string, any>) => {
  return post<AnswerResultType>("answer/add", { examId, content });
};

// // 试卷详情
// export const findExam = (id: number) => {
//   return get<ExamData>("exam/find/" + id);
// };
