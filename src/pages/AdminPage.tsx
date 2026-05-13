import { useState } from "react";
import { uploadImage } from "../cloudinary";
import DateSelector, { getDateString } from "../components/DateSelector";
import ImageUploader from "../components/ImageUploader";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [dateType, setDateType] = useState<"today" | "tomorrow" | "custom">(
    "today"
  );
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const { add } = useSimpleAdd();

  const dateStr = getDateString(dateType, customDate);

  function handleFileChange(f: File | null) {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !file) {
      setMessage("Vui lòng nhập tên và chọn ảnh");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      const imageUrl = await uploadImage(file);
      await add({ name: name.trim(), imageUrl, date: dateStr });
      setName("");
      setFile(null);
      setPreview(null);
      setMessage("✅ Đã lưu điểm danh thành công!");
    } catch {
      setMessage("❌ Lỗi khi lưu. Thử lại nhé.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page">
      <h1>📋 Điểm Danh Trực Nhật</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <h2>➕ Thêm người trực</h2>

        <label className="field">
          <span>Tên người trực</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên..."
            disabled={uploading}
          />
        </label>

        <DateSelector
          dateType={dateType}
          customDate={customDate}
          onDateTypeChange={setDateType}
          onCustomDateChange={setCustomDate}
          disabled={uploading}
        />

        <ImageUploader
          preview={preview}
          onFileChange={handleFileChange}
          disabled={uploading}
        />

        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? "⏳ Đang upload..." : "💾 Lưu điểm danh"}
        </button>
        {message && (
          <p className={`msg ${message.startsWith("✅") ? "ok" : "err"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

// Small inline hook to just add records without needing DayGroup/records UI
import { useCallback } from "react";
import { addRecord } from "../db";
import type { AttendanceRecord } from "../types";

function useSimpleAdd() {
  const add = useCallback(
    async (data: Omit<AttendanceRecord, "id" | "createdAt">) => {
      await addRecord(data);
    },
    []
  );
  return { add };
}
