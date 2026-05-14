import { useState } from "react";
import "./PersonImage/styles.css";

interface PersonImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  square?: boolean;
}

export default function PersonImage({
  src,
  alt,
  className = "",
  onClick,
  square = true,
}: PersonImageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`person-image ${
        square ? "person-image--square" : ""
      } ${className}${onClick ? " person-image--clickable" : ""}`}
      onClick={onClick}
    >
      {imgError || !src ? (
        <div className="person-image-fallback">👤</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="person-image-img"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
