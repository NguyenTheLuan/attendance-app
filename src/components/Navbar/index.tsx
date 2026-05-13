import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close drawer on route change
  function handleNavClick() {
    setOpen(false);
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
          ✏️ Nhập điểm danh
        </NavLink>
        <NavLink to="/view" className={linkClass} onClick={handleNavClick}>
          👁️ Xem lịch trực
        </NavLink>
        <NavLink to="/stats" className={linkClass} onClick={handleNavClick}>
          📊 Thống kê
        </NavLink>
        {isLoggedIn && (
          <button className="nav-link logout-btn" onClick={onLogout}>
            🚪 Thoát
          </button>
        )}
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
          <h3>🍜 Menu</h3>
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
          ✏️ Nhập điểm danh
        </NavLink>
        <NavLink to="/view" className={linkClass} onClick={handleNavClick}>
          👁️ Xem lịch trực
        </NavLink>
        <NavLink to="/stats" className={linkClass} onClick={handleNavClick}>
          📊 Thống kê
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
              🚪 Thoát
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
