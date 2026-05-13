import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (username === "ntluan" && password === "123") {
      localStorage.setItem("attendance_logged_in", "true");
      onLogin();
      navigate("/admin");
    } else {
      setError("❌ Sai tài khoản hoặc mật khẩu");
    }
  }

  return (
    <div className="page login-page">
      <div className="card login-card">
        <h1>🔐 Đăng nhập</h1>
        <p className="subtitle">
          Chỉ quản trị viên mới có quyền nhập điểm danh
        </p>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Tài khoản</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản..."
              autoFocus
            />
          </label>
          <label className="field">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
            />
          </label>
          {error && <p className="msg err">{error}</p>}
          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
