import { useState } from "react";
import type { AttendanceRecord } from "~/types";

interface EditModalProps {
  record: AttendanceRecord;
  onSave: (data: {
    name: string;
    date: string;
    imageUrl: string;
  }) => Promise<void>;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function EditModal({
  record,
  onSave,
  onDelete,
  onClose,
}: EditModalProps) {
  const [name, setName] = useState(record.name);
  const [date, setDate] = useState(record.date);
  const [imageUrl, setImageUrl] = useState(record.imageUrl);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), date, imageUrl });
      onClose();
    } catch {
      alert("Lỗi khi lưu. Thử lại nhé.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Chỉnh sửa thông tin</h3>

        <label className="field">
          <span>Tên người trực</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="field">
          <span>Ngày trực</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="field">
          <span>URL ảnh</span>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={saving}
          />
        </label>

        {imageUrl && <img src={imageUrl} alt="preview" className="preview" />}

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? "⏳ Đang lưu..." : "💾 Lưu"}
          </button>
          <button
            className="btn-delete"
            onClick={() => {
              if (window.confirm("Bạn có chắc muốn xóa lượt trực này?")) {
                onDelete(record.id);
                onClose();
              }
            }}
            disabled={saving}
          >
            🗑 Xóa
          </button>
          <button className="btn-cancel" onClick={onClose} disabled={saving}>
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
