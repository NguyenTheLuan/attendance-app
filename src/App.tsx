import { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "~/pages/AdminPage";
import ViewPage from "~/pages/ViewPage";
import StatsPage from "~/pages/StatsPage";
import LoginPage from "~/pages/LoginPage";
import ErrorBoundary from "~/components/ErrorBoundary";
import Navbar from "~/components/Navbar";
import "~/App.css";
import "~/components/ConfirmDialog/styles.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("attendance_logged_in") === "true"
  );

  function handleLogout() {
    localStorage.removeItem("attendance_logged_in");
    setIsLoggedIn(false);
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
