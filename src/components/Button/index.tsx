import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./styles.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "export" | "cancel" | "danger";
  children: ReactNode;
}

const variantClass: Record<string, string> = {
  primary: "btn-primary",
  export: "btn-export",
  cancel: "btn-cancel",
  danger: "btn-danger",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = [variantClass[variant] || "btn-primary", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
