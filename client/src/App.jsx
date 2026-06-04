import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./components/ui";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateUrl from "./pages/CreateUrl";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./styles/global.css";

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080c14]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Routes>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreateUrl /></PrivateRoute>} />
          <Route path="/analytics/:id" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </Router>
  );
}
