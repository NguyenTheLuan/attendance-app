import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

/**
 * Reusable Card container.
 * Default padding is true. Set `padding={false}` to remove padding
 * if children manage their own spacing (e.g., charts).
 *
 * @example
 * <Card>Default padded card</Card>
 * <Card padding={false}>No padding, e.g. charts</Card>
 */
export default function Card({
  children,
  className = "",
  padding = true,
}: CardProps) {
  const cls = padding ? "card" : "card card--no-padding";

  return (
    <div className={cls + (className ? " " + className : "")}>{children}</div>
  );
}
