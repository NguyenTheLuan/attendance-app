import { useState } from "react";
import { useTheme } from "~/hooks/useTheme";
import "~/pages/SettingsPage/styles.css";

interface SettingsPageProps {
  onLogout: () => void;
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const { theme, setTheme, themes } = useTheme();
  const [forceCamera, setForceCamera] = useState(() => {
    return localStorage.getItem("attendance_force_camera") === "true";
  });
  const [stampGPS, setStampGPS] = useState(true);

  function toggleForceCamera() {
    const newVal = !forceCamera;
    setForceCamera(newVal);
    localStorage.setItem("attendance_force_camera", newVal.toString());
  }

  return (
    <div className="page settings-page">
      <h1>⚙️ Cài đặt hệ thống</h1>

      <div className="settings-section">
        <div className="settings-section-title">Quản lý điểm danh</div>
        <div className="settings-group">
          <div className="setting-row">
            <span className="setting-icon">📸</span>
            <div className="setting-info">
              <div className="setting-label">Bắt buộc chụp trực tiếp</div>
              <div className="setting-desc">Không cho phép tải ảnh từ thư viện</div>
            </div>
            <div
              className={`toggle ${forceCamera ? "on" : ""}`}
              onClick={toggleForceCamera}
            />
          </div>
          <div className="setting-row">
            <span className="setting-icon">📍</span>
            <div className="setting-info">
              <div className="setting-label">Đánh dấu vị trí GPS</div>
              <div className="setting-desc">Gắn tọa độ lên ảnh khi chụp</div>
            </div>
            <div
              className={`toggle ${stampGPS ? "on" : ""}`}
              onClick={() => setStampGPS(!stampGPS)}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Giao diện</div>
        <div className="settings-group theme-options">
          {themes.map((t) => (
            <div
              key={t.value}
              className={`theme-option ${theme === t.value ? "selected" : ""}`}
              onClick={() => setTheme(t.value)}
            >
              <div
                className="theme-dot"
                style={{
                  background:
                    t.value === "light-classic" ? "#f8f9fa" :
                    t.value === "light-warm" ? "#fffcf7" :
                    t.value === "dark-premium" ? "#171717" :
                    t.value === "dark-oled" ? "#000" :
                    "linear-gradient(135deg, #e0e7ff, #f0e7ff)",
                  borderColor:
                    t.value === "light-classic" ? "#ccc" :
                    t.value === "light-warm" ? "#ede6db" :
                    t.value === "dark-premium" ? "#333" :
                    t.value === "dark-oled" ? "#333" :
                    "#c4b5fd"
                }}
              />
              <span className="theme-name">
                {t.icon} {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Tài khoản</div>
        <div className="settings-group">
          <button className="btn-danger-full" onClick={onLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
