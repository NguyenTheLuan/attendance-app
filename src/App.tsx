import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import ViewPage from "./pages/ViewPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/admin" className="nav-link">
          ✏️ Nhập điểm danh
        </Link>
        <Link to="/view" className="nav-link">
          👁️ Xem lịch trực
        </Link>
      </nav>
      <main>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/view" element={<ViewPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
