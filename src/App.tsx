import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import ViewPage from "./pages/ViewPage";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

export default function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
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
            <Route
              path="/admin"
              element={
                <ErrorBoundary>
                  <AdminPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/view"
              element={
                <ErrorBoundary>
                  <ViewPage />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </HashRouter>
  );
}
