import { useState, useRef } from "react";
import { uploadImage } from "~/services/cloudinary";
import type { AttendanceRecord } from "~/types";

interface EditModalProps {
  record: AttendanceRecord;
  onSave: (data: {
    name: string;
    date: string;
    imageUrl: string;
    note?: string;
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
  const [note, setNote] = useState(record.note ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      let imageUrl = record.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file);
      }
      await onSave({
        name: name.trim(),
        date,
        imageUrl,
        note: note.trim() || undefined,
      });
      onClose();
    } catch {
      alert("Lỗi khi lưu. Thử lại nhé.");
    } finally {
      setSaving(false);
    }
  }

  const currentPreview = preview || record.imageUrl;

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
          <span>Ảnh người trực</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={saving}
          />
          {currentPreview && (
            <img src={currentPreview} alt="Preview" className="preview" />
          )}
        </label>

        <label className="field">
          <span>Ghi chú</span>
          <textarea
            className="field-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: hỗ trợ nhảy cầu Tăng Long..."
            disabled={saving}
            rows={2}
          />
        </label>

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
              onDelete(record.id);
              onClose();
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
