import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "~/pages/AdminPage";
import ViewPage from "~/pages/ViewPage";
import StatsPage from "~/pages/StatsPage";
import LoginPage from "~/pages/LoginPage";
import ErrorBoundary from "~/components/ErrorBoundary";
import Navbar from "~/components/Navbar";
import { zmaGetItem, zmaRemoveItem } from "~/services/zma";
import "~/App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      try {
        const val = await zmaGetItem("attendance_logged_in");
        setIsLoggedIn(val === "true");
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  async function handleLogout() {
    await zmaRemoveItem("attendance_logged_in");
    setIsLoggedIn(false);
  }

  // Show minimal loading while checking login state
  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "2rem" }}>
        Đang tải...
      </div>
    );
  }

  return (
    <HashRouter>
      <ErrorBoundary>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
                  <ViewPage isLoggedIn={isLoggedIn} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/stats"
              element={
                <ErrorBoundary>
                  <StatsPage isLoggedIn={isLoggedIn} />
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
