import { HashRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import ViewPage from "./pages/ViewPage";
import StatsPage from "./pages/StatsPage";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

export default function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <nav className="navbar">
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            ✏️ Nhập điểm danh
          </NavLink>
          <NavLink
            to="/view"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            👁️ Xem lịch trực
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            📊 Thống kê
          </NavLink>
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
            <Route
              path="/stats"
              element={
                <ErrorBoundary>
                  <StatsPage />
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
