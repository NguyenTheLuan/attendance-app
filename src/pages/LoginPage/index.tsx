import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PASSWORD = "123456";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === PASSWORD) {
      localStorage.setItem("attendance_logged_in", "true");
      onLogin();
      navigate("/admin");
    } else {
      setError(true);
    }
  }

  return (
    <div className="page">
      <div className="card form" style={{ maxWidth: 360, margin: "40px auto" }}>
        <h2>🔐 Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Nhập mật khẩu..."
              autoFocus
            />
          </label>
          {error && (
            <p className="msg err">❌ Sai mật khẩu, vui lòng thử lại.</p>
          )}
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: 8 }}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
