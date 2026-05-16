import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "~/components/Field";
import { isZMA, zmaLogin, zmaSetItem } from "~/services/zma";

const PASSWORD = "123456";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [zmaLoading, setZmaLoading] = useState(false);

  const runningInZMA = isZMA();

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === PASSWORD) {
      await zmaSetItem("attendance_logged_in", "true");
      onLogin();
      navigate("/admin");
    } else {
      setError(true);
    }
  }

  async function handleZaloLogin() {
    setZmaLoading(true);
    try {
      const result = await zmaLogin();
      if (result) {
        // Zalo login successful – auto-login for admin
        await zmaSetItem("attendance_logged_in", "true");
        // Optionally store Zalo access token for later API usage
        await zmaSetItem("zalo_access_token", result.accessToken);
        onLogin();
        navigate("/admin");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setZmaLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="login-card card form">
        <h2>🔐 Đăng nhập</h2>

        {/* Password login (works everywhere) */}
        <form onSubmit={handlePasswordSubmit}>
          <Field
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Nhập mật khẩu..."
            autoFocus
          />
          {error && (
            <p className="msg err">❌ Sai mật khẩu, vui lòng thử lại.</p>
          )}
          <button type="submit" className="btn-primary login-btn">
            Đăng nhập
          </button>
        </form>

        {/* Zalo login (only when running inside ZMA) */}
        {runningInZMA && (
          <>
            <div className="login-divider">
              <span>hoặc</span>
            </div>
            <button
              className="btn-zalo login-btn"
              onClick={handleZaloLogin}
              disabled={zmaLoading}
            >
              {zmaLoading ? "Đang đăng nhập..." : "Đăng nhập bằng Zalo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
