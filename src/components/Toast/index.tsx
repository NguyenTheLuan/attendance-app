import { useEffect, useState } from "react";
import "~/components/Toast/styles.css";

interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  show,
  message,
  type = "error",
  onClose,
  duration = 3000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, show]);

  if (!show) return null;

  return (
    <div
      className={`toast toast-${type} ${visible ? "toast-visible" : ""}`}
      role="alert"
    >
      <span className="toast-icon">{type === "success" ? "✅" : "❌"}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
