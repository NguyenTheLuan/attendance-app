import { useState } from "react";
import { uploadImage } from "../cloudinary";
import { useRecords } from "../hooks/useRecords";
import DayGroup from "../components/DayGroup";
import DateSelector, { getDateString } from "../components/DateSelector";
import ImageUploader from "../components/ImageUploader";
import ConfirmDialog from "../components/ConfirmDialog";
import { exportRecordsToCsv } from "../utils/exportCsv";

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
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { records, loading, add, remove } = useRecords();

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

  async function handleConfirmDelete() {
    if (confirmDelete) {
      await remove(confirmDelete);
      setConfirmDelete(null);
    }
  }

  // Filter logic
  const searchLower = search.toLowerCase().trim();
  const filteredRecords = searchLower
    ? records.filter((r) => r.name.toLowerCase().includes(searchLower))
    : records;

  const grouped = filteredRecords.reduce<Record<string, typeof records>>(
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

      <div className="history">
        <div className="history-header">
          <h2>📅 Lịch sử điểm danh</h2>
          <div className="history-actions">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Tìm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {records.length > 0 && (
              <button
                className="btn-export"
                onClick={() => exportRecordsToCsv(records)}
                title="Xuất CSV"
              >
                📥 Xuất CSV
              </button>
            )}
          </div>
        </div>

        {loading && <p className="loading">⏳ Đang tải...</p>}

        {!loading && Object.keys(grouped).length === 0 && (
          <p>
            {search ? "Không tìm thấy kết quả." : "Chưa có dữ liệu điểm danh."}
          </p>
        )}

        {Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, items]) => (
            <DayGroup
              key={date}
              date={date}
              records={items}
              onDelete={(id) => setConfirmDelete(id)}
            />
          ))}
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa mục điểm danh này?"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
