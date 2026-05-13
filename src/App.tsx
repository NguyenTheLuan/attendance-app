import { useState } from "react";
import { HashRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import ViewPage from "./pages/ViewPage";
import StatsPage from "./pages/StatsPage";
import LoginPage from "./pages/LoginPage";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <HashRouter>
      <ErrorBoundary>
        {isLoggedIn && (
          <nav className="navbar">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              ✏️ Nhập điểm danh
            </NavLink>
            <NavLink
              to="/view"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              👁️ Xem lịch trực
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              📊 Thống kê
            </NavLink>
            <button
              className="nav-link logout-btn"
              onClick={() => setIsLoggedIn(false)}
            >
              🚪 Thoát
            </button>
          </nav>
        )}
        <main>
          <Routes>
            <Route
              path="/login"
              element={
                <ErrorBoundary>
                  <LoginPage onLogin={() => setIsLoggedIn(true)} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin"
              element={
                <ErrorBoundary>
                  {isLoggedIn ? (
                    <AdminPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )}
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
            <Route path="*" element={<Navigate to="/view" replace />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </HashRouter>
  );
}
