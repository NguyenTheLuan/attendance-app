import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "~/pages/AdminPage";
import ViewPage from "~/pages/ViewPage";
import StatsPage from "~/pages/StatsPage";
import LoginPage from "~/pages/LoginPage";
import SettingsPage from "~/pages/SettingsPage";
import ErrorBoundary from "~/components/ErrorBoundary";
import BottomNav from "~/components/BottomNav";
import "~/App.css";
import "~/components/Button/styles.css";

// A wrapper to hide BottomNav on Login page
import { useLocation } from "react-router-dom";

function AppContent({
  isLoggedIn,
  onLogout,
  onLogin
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
}) {
  const location = useLocation();
  const showNav = location.pathname !== "/login";

  return (
    <>
      <main>
        <Routes>
          <Route
            path="/login"
            element={
              <ErrorBoundary>
                <LoginPage onLogin={onLogin} />
              </ErrorBoundary>
            }
          />
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
          <Route
            path="/settings"
            element={
              <ErrorBoundary>
                {isLoggedIn ? (
                  <SettingsPage onLogout={onLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )}
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<Navigate to="/view" replace />} />
        </Routes>
      </main>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function checkLogin() {
      try {
        const val = localStorage.getItem("attendance_logged_in");
        setIsLoggedIn(val === "true");
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  function handleLogout() {
    localStorage.removeItem("attendance_logged_in");
    setIsLoggedIn(false);
  }

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
        <AppContent
          isLoggedIn={isLoggedIn}
          onLogin={() => setIsLoggedIn(true)}
          onLogout={handleLogout}
        />
      </ErrorBoundary>
    </HashRouter>
  );
}
