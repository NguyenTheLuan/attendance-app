import { useRef, useState, type DragEvent } from "react";

interface ImageUploaderProps {
  preview: string | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  preview,
  onFileChange,
  disabled = false,
}: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onFileChange(f);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f && f.type.startsWith("image/")) {
      onFileChange(f);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleClick() {
    if (!disabled) fileRef.current?.click();
  }

  return (
    <div className="field">
      <span>Ảnh người trực</span>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        style={{ display: "none" }}
      />

      {preview ? (
        <div className="uploader-preview-wrapper" onClick={handleClick}>
          <img src={preview} alt="Preview" className="uploader-preview" />
          <div className="uploader-overlay">
            <span>📷 Nhấn để đổi ảnh</span>
          </div>
        </div>
      ) : (
        <div
          className={`uploader-dropzone ${dragging ? "dragging" : ""}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="uploader-icon">📸</div>
          <div className="uploader-text">
            <strong>Nhấn để chọn ảnh</strong>
            <span>hoặc kéo thả ảnh vào đây</span>
          </div>
          <div className="uploader-hint">Hỗ trợ JPG, PNG, WEBP</div>
        </div>
      )}
    </div>
  );
}
