import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import ExamList from "@/pages/ExamList";
import ExamEdit from "@/pages/ExamEdit";
import ExamPaper from "@/pages/ExamPaper";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/examList" replace />,
      },
      {
        path: "examList",
        element: <ExamList />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "exam/edit/:id",
        element: <ExamEdit />,
      },
      {
        path: "exam/paper/:id",
        element: <ExamPaper />,
      },
    ],
  },
]);

export default router;
