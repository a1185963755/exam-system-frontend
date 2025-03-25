import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    const publicPaths = ["/login", "/register"];

    if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  return <Outlet />;
};

export default App;
