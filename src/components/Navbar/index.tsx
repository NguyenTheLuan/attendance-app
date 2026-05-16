import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "~/hooks/useTheme";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, themes } = useTheme();

  const currentTheme = themes.find((t) => t.value === theme) ?? themes[0];

  // Close drawer on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    if (open || themeOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, themeOpen]);

  // Close drawer on route change
  function handleNavClick() {
    setOpen(false);
    setThemeOpen(false);
  }

  function handleOverlayClick() {
    setOpen(false);
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar">
      {/* Desktop links */}
      <div className="navbar-desktop">
        <NavLink
          to={isLoggedIn ? "/admin" : "/login"}
          className={linkClass}
          onClick={handleNavClick}
        >
          <span className="nav-icon">✏️</span> Nhập điểm danh
        </NavLink>
        <NavLink to="/view" className={linkClass} onClick={handleNavClick}>
          <span className="nav-icon">👁️</span> Xem lịch trực
        </NavLink>
        <NavLink to="/stats" className={linkClass} onClick={handleNavClick}>
          <span className="nav-icon">📊</span> Thống kê
        </NavLink>
        {isLoggedIn && (
          <button className="nav-link logout-btn" onClick={onLogout}>
            <span className="nav-icon">🚪</span> Thoát
          </button>
        )}

        {/* Theme Selector */}
        <div className="theme-selector" ref={themeRef}>
          <button
            className="theme-selector-btn"
            onClick={() => setThemeOpen((o) => !o)}
            aria-label="Chọn giao diện"
          >
            <span className="theme-icon">{currentTheme.icon}</span>
            <span className="theme-label">{currentTheme.label}</span>
          </button>
          {themeOpen && (
            <div className="theme-selector-dropdown">
              {themes.map((t) => (
                <button
                  key={t.value}
                  className={`theme-option${
                    t.value === theme ? " active" : ""
                  }`}
                  onClick={() => {
                    setTheme(t.value);
                    setThemeOpen(false);
                  }}
                >
                  <span className="theme-option-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hamburger button (mobile only) */}
      <button
        className={`navbar-hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay */}
      {open && <div className="navbar-overlay" onClick={handleOverlayClick} />}

      {/* Drawer */}
      <div ref={menuRef} className={`navbar-drawer ${open ? "open" : ""}`}>
        <div className="navbar-drawer-header">
          <h3>Menu</h3>
          <button
            className="navbar-drawer-close"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <NavLink
          to={isLoggedIn ? "/admin" : "/login"}
          className={linkClass}
          onClick={handleNavClick}
        >
          <span className="nav-icon">✏️</span> Nhập điểm danh
        </NavLink>
        <NavLink to="/view" className={linkClass} onClick={handleNavClick}>
          <span className="nav-icon">👁️</span> Xem lịch trực
        </NavLink>
        <NavLink to="/stats" className={linkClass} onClick={handleNavClick}>
          <span className="nav-icon">📊</span> Thống kê
        </NavLink>
        {isLoggedIn && (
          <>
            <hr className="navbar-divider" />
            <button
              className="nav-link logout-btn"
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              <span className="nav-icon">🚪</span> Thoát
            </button>
          </>
        )}

        {/* Theme Selector in Drawer (mobile only) */}
        <hr className="navbar-divider drawer-theme-divider" />
        <div className="drawer-theme-section">
          <div className="drawer-theme-label">
            <span className="theme-icon">{currentTheme.icon}</span> Chọn giao
            diện
          </div>
          <div className="drawer-theme-options">
            {themes.map((t) => (
              <button
                key={t.value}
                className={`drawer-theme-option${
                  t.value === theme ? " active" : ""
                }`}
                onClick={() => {
                  setTheme(t.value);
                  setThemeOpen(false);
                }}
              >
                <span className="theme-option-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
