import { useState, useCallback } from "react";
import { isAbsentNote } from "~/utils/absence";
import { uploadImage } from "~/services/cloudinary";
import Field from "~/components/Field";
import DateSelector, { getDateString } from "~/components/DateSelector";
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
  const [isSuccess, setIsSuccess] = useState(false);

  const isAbsent = isAbsentNote(note);
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
    if (!name.trim()) {
      setMessage("Vui lòng nhập tên");
      return;
    }
    if (!isAbsent && !file) {
      setMessage("Vui lòng chọn ảnh");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      let imageUrl = "";
      if (!isAbsent && file) {
        imageUrl = await uploadImage(file);
      }
      // Split names by comma, trim each, filter empty
      const names = name
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      for (const n of names) {
        await handleAdd({
          name: n,
          imageUrl,
          date: dateStr,
          note: note.trim() || "",
        });
      }
      setName("");
      setNote("");
      setFile(null);
      setPreview(null);
      const count = names.length;
      setMessage(`✅ Đã lưu điểm danh ${count} người thành công!`);
      setIsSuccess(true);
    } catch (err) {
      console.error("Lỗi khi lưu record:", err);
      setMessage("❌ Lỗi khi lưu. Thử lại nhé.");
      setIsSuccess(false);
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
          placeholder="Nhập tên... (có thể nhập nhiều tên, cách nhau bằng dấu phẩy)"
          disabled={uploading}
        />

        <DateSelector
          dateType={dateType}
          customDate={customDate}
          onDateTypeChange={setDateType}
          onCustomDateChange={setCustomDate}
          disabled={uploading}
        />

        {!isAbsent && (
          <ImageUploader
            preview={preview}
            onFileChange={handleFileChange}
            disabled={uploading}
          />
        )}

        <Field
          as="textarea"
          label="Ghi chú"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
          placeholder={
            isAbsent ? "Ví dụ: vắng (không cần ảnh)" : "Ví dụ: hỗ trợ..."
          }
          disabled={uploading}
          rows={2}
        />

        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? "⏳ Đang upload..." : "💾 Lưu điểm danh"}
        </button>
        {message && (
          <p className={`msg ${isSuccess ? "ok" : "err"}`}>{message}</p>
        )}
      </form>
    </div>
  );
}
