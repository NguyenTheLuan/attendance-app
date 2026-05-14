import { useState, useCallback } from "react";
import { uploadImage } from "~/services/cloudinary";
import Field from "~/components/Field";
import DateSelector from "~/components/DateSelector";
import ImageUploader from "~/components/ImageUploader";
import { addRecord } from "~/services/db";
import type { AttendanceRecord } from "~/types";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
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

  function getDateString(
    type: "today" | "tomorrow" | "custom",
    custom: string
  ) {
    if (type === "custom") return custom;
    const d = new Date();
    if (type === "tomorrow") d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

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

  const handleAdd = useCallback(
    async (data: Omit<AttendanceRecord, "id" | "createdAt">) => {
      await addRecord(data);
    },
    []
  );

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
      await handleAdd({
        name: name.trim(),
        imageUrl,
        date: dateStr,
        note: note.trim() || "",
      });
      setName("");
      setNote("");
      setFile(null);
      setPreview(null);
      setMessage("✅ Đã lưu điểm danh thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu record:", err);
      setMessage("❌ Lỗi khi lưu. Thử lại nhé.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page">
      <h1>📋 Điểm Danh Trực</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <h2>➕ Thêm người trực</h2>

        <Field
          label="Tên người trực"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên..."
          disabled={uploading}
        />

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

        <Field
          as="textarea"
          label="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ví dụ: hỗ trợ..."
          disabled={uploading}
          rows={2}
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
