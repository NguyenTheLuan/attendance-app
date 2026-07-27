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
    let subscription: { unsubscribe: () => void } | null = null;
    
    async function checkLogin() {
      try {
        const { getSession, onAuthStateChange } = await import("~/services/auth");
        const session = await getSession();
        setIsLoggedIn(!!session);
        
        subscription = onAuthStateChange((status) => {
          setIsLoggedIn(status);
        });
      } catch (err) {
        console.error("Auth init error", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
    
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      const { signOut } = await import("~/services/auth");
      await signOut();
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout error", err);
    }
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
