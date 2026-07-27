import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "~/hooks/useTheme";
import { useTranslation } from "~/hooks/useTranslation";
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
  const [testMode, setTestMode] = useState(() => {
    return localStorage.getItem("attendance_test_mode") === "true";
  });

  function toggleForceCamera() {
    const newVal = !forceCamera;
    setForceCamera(newVal);
    localStorage.setItem("attendance_force_camera", newVal.toString());
  }

  function toggleTestMode() {
    const newVal = !testMode;
    setTestMode(newVal);
    if (newVal) {
      localStorage.setItem("attendance_test_mode", "true");
    } else {
      localStorage.removeItem("attendance_test_mode");
      delete (window as any).__MOCK_DATA__;
    }
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleLogoutClick() {
    navigate("/view");
    onLogout();
  }

  return (
    <div className="page settings-page">
      <h1>{t("settings.title")}</h1>

      <div className="settings-section">
        <div className="settings-section-title">{t("settings.attendance")}</div>
        <div className="settings-group">
          <div className="setting-row">
            <span className="setting-icon">📸</span>
            <div className="setting-info">
              <div className="setting-label">{t("settings.forceCamera")}</div>
              <div className="setting-desc">{t("settings.forceCameraDesc")}</div>
            </div>
            <div
              className={`toggle ${forceCamera ? "on" : ""}`}
              onClick={toggleForceCamera}
            />
          </div>
          <div className="setting-row">
            <span className="setting-icon">📍</span>
            <div className="setting-info">
              <div className="setting-label">{t("settings.gps")}</div>
              <div className="setting-desc">{t("settings.gpsDesc")}</div>
            </div>
            <div
              className={`toggle ${stampGPS ? "on" : ""}`}
              onClick={() => setStampGPS(!stampGPS)}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">{t("settings.appearance")}</div>
        <div className="settings-group theme-options">
          {themes.map((themeOption) => (
            <div
              key={themeOption.value}
              className={`theme-option ${theme === themeOption.value ? "selected" : ""}`}
              onClick={() => setTheme(themeOption.value)}
            >
              <div
                className="theme-dot"
                style={{
                  background:
                    themeOption.value === "light-classic" ? "#f8f9fa" :
                    themeOption.value === "light-warm" ? "#fffcf7" :
                    themeOption.value === "dark-premium" ? "#171717" :
                    themeOption.value === "dark-oled" ? "#000" :
                    "linear-gradient(135deg, #e0e7ff, #f0e7ff)",
                  borderColor:
                    themeOption.value === "light-classic" ? "#ccc" :
                    themeOption.value === "light-warm" ? "#ede6db" :
                    themeOption.value === "dark-premium" ? "#333" :
                    themeOption.value === "dark-oled" ? "#333" :
                    "#c4b5fd"
                }}
              />
              <span className="theme-name">
                {themeOption.icon} {t(`theme.${themeOption.value}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">{t("dev.title")}</div>
        <div className="settings-group">
          <div className="setting-row">
            <span className="setting-icon">🧪</span>
            <div className="setting-info">
              <div className="setting-label">{t("dev.generateData")}</div>
              <div className="setting-desc">{t("dev.testDesc")}</div>
            </div>
            <div
              className={`toggle ${testMode ? "on" : ""}`}
              onClick={toggleTestMode}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">{t("settings.account")}</div>
        <div className="settings-group">
          <button className="btn-danger-full" onClick={handleLogoutClick}>
            {t("settings.logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
