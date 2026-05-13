import { useRef } from "react";

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onFileChange(f);
  }

  return (
    <label className="field">
      <span>Ảnh người trực</span>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        disabled={disabled}
      />
      {preview && <img src={preview} alt="Preview" className="preview" />}
    </label>
  );
}
