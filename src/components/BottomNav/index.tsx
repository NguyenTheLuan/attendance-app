import { NavLink } from "react-router-dom";
import "./styles.css";

export default function BottomNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `bottom-nav-item${isActive ? " active" : ""}`;

  return (
    <nav className="bottom-nav">
      <NavLink to="/admin" className={linkClass}>
        <span className="bottom-nav-icon">📷</span>
        <span className="bottom-nav-label">Điểm danh</span>
      </NavLink>
      <NavLink to="/view" className={linkClass}>
        <span className="bottom-nav-icon">👁️</span>
        <span className="bottom-nav-label">Xem</span>
      </NavLink>
      <NavLink to="/stats" className={linkClass}>
        <span className="bottom-nav-icon">📊</span>
        <span className="bottom-nav-label">Thống kê</span>
      </NavLink>
      <NavLink to="/settings" className={linkClass}>
        <span className="bottom-nav-icon">⚙️</span>
        <span className="bottom-nav-label">Cài đặt</span>
      </NavLink>
    </nav>
  );
}
