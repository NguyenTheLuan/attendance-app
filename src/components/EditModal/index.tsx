import { useState } from "react";
import { uploadImage } from "~/services/cloudinary";
import type { AttendanceRecord } from "~/types";
import Field from "~/components/Field";
import ImageUploader from "~/components/ImageUploader";

interface EditModalProps {
  record: AttendanceRecord;
  onSave: (data: {
    name: string;
    date: string;
    imageUrl: string;
    note?: string;
  }) => Promise<void>;
  onClose: () => void;
}

export default function EditModal({ record, onSave, onClose }: EditModalProps) {
  const [name, setName] = useState(record.name);
  const [date, setDate] = useState(record.date);
  const [note, setNote] = useState(record.note ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSave() {
    if (!name.trim()) {
      setError("Vui lòng nhập tên");
      return;
    }
    setError("");
    setSaving(true);
    try {
      let imageUrl = record.imageUrl ?? "";
      if (file) {
        imageUrl = await uploadImage(file);
      }
      await onSave({
        name: name.trim(),
        date,
        imageUrl,
        note: note.trim() || "",
      });
      onClose();
    } catch {
      setError("Lỗi khi lưu. Thử lại nhé.");
    } finally {
      setSaving(false);
    }
  }

  const currentPreview = (preview || record.imageUrl) ?? null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-edit" onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Chỉnh sửa thông tin</h3>

        <div className="edit-layout">
          <div className="edit-image-col">
            <ImageUploader
              preview={currentPreview}
              onFileChange={handleFileChange}
              disabled={saving}
            />
          </div>

          <div className="edit-form-col">
            <Field
              label="Tên người trực"
              row
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />

            <Field
              label="Ngày trực"
              row
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={saving}
            />

            <Field
              as="textarea"
              label="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: hỗ trợ..."
              disabled={saving}
              rows={3}
            />

            {error && <p className="msg err">{error}</p>}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? "⏳ Đang lưu..." : "💾 Lưu"}
          </button>
          <button className="btn-cancel" onClick={onClose} disabled={saving}>
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
