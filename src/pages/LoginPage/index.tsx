import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "~/hooks/useTranslation";
import "~/pages/LoginPage/styles.css";

const PASSWORD = "123456";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === PASSWORD) {
      localStorage.setItem("attendance_logged_in", "true");
      onLogin();
      navigate("/settings");
    } else {
      setError(true);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-emblem">
        <svg viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.83-3.4 9.36-7 10.5-3.6-1.14-7-5.67-7-10.5V6.3l7-3.12z" />
          <path d="M12 7l-3 3h2v4h2v-4h2l-3-3z" />
        </svg>
      </div>
      <h1 className="login-title">{t("login.title")}</h1>
      <p className="login-sub">{t("login.sub")}</p>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <label className="login-label">{t("login.passwordLabel")}</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder={t("login.passwordPlaceholder")}
            autoFocus
          />
          {error && <div className="login-error">{t("login.error")}</div>}
          <button type="submit" className="login-btn">
            {t("login.submit")}
          </button>
        </form>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button 
            type="button" 
            className="login-back-btn" 
            onClick={() => navigate("/view")}
          >
            {t("common.backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
