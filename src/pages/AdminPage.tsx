import { useState, useRef, useCallback, useEffect } from "react";
import { uploadImage } from "../cloudinary";
import { addRecord, getAllRecords, deleteRecordById } from "../db";
import type { AttendanceRecord } from "../types";

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export default function AdminPage() {
  const [name, setName] = useState("");
  const [dateType, setDateType] = useState<"today" | "tomorrow" | "custom">(
    "today"
  );
  const [customDate, setCustomDate] = useState(getTodayStr());
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const dateStr =
    dateType === "today"
      ? getTodayStr()
      : dateType === "tomorrow"
      ? getTomorrowStr()
      : customDate;

  const loadRecords = useCallback(async () => {
    const data = await getAllRecords();
    setRecords(data);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
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
      await addRecord({ name: name.trim(), imageUrl, date: dateStr });
      setName("");
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setMessage("✅ Đã lưu điểm danh thành công!");
      loadRecords();
    } catch {
      setMessage("❌ Lỗi khi lưu. Thử lại nhé.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteRecordById(id);
    loadRecords();
  }

  const grouped = records.reduce<Record<string, AttendanceRecord[]>>(
    (acc, r) => {
      (acc[r.date] ??= []).push(r);
      return acc;
    },
    {}
  );

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

        <label className="field">
          <span>Ngày trực</span>
          <div className="row">
            <button
              type="button"
              className={dateType === "today" ? "active" : ""}
              onClick={() => setDateType("today")}
            >
              Hôm nay
            </button>
            <button
              type="button"
              className={dateType === "tomorrow" ? "active" : ""}
              onClick={() => setDateType("tomorrow")}
            >
              Mai
            </button>
            <button
              type="button"
              className={dateType === "custom" ? "active" : ""}
              onClick={() => setDateType("custom")}
            >
              Ngày khác
            </button>
          </div>
          {dateType === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              disabled={uploading}
            />
          )}
        </label>

        <label className="field">
          <span>Ảnh người trực</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {preview && <img src={preview} alt="Preview" className="preview" />}
        </label>

        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? "⏳ Đang upload..." : "💾 Lưu điểm danh"}
        </button>
        {message && (
          <p className={`msg ${message.startsWith("✅") ? "ok" : "err"}`}>
            {message}
          </p>
        )}
      </form>

      <div className="history">
        <h2>📅 Lịch sử điểm danh</h2>
        {Object.keys(grouped).length === 0 && <p>Chưa có dữ liệu điểm danh.</p>}
        {Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, items]) => (
            <div key={date} className="card day-group">
              <h3 className="day-title">📌 {formatDate(date)}</h3>
              <div className="grid">
                {items.map((r) => (
                  <div key={r.id} className="person-card">
                    <img src={r.imageUrl} alt={r.name} />
                    <p>{r.name}</p>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(r.id)}
                      title="Xóa"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
