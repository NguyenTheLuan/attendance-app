import type { AttendanceRecord } from "~/types";
import "./styles.css";

interface PersonDetailModalProps {
  record: AttendanceRecord;
  onClose: () => void;
}

/**
 * Read-only detail modal that mimics EditModal layout (image left + info right).
 * No edit/delete buttons — just view details and close.
 */
export default function PersonDetailModal({
  record,
  onClose,
}: PersonDetailModalProps) {
  const d = new Date(record.date + "T00:00:00");
  const dayOfWeek = d.toLocaleDateString("vi-VN", { weekday: "long" });
  const formattedDate = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-edit" onClick={(e) => e.stopPropagation()}>
        <h3>👤 Thông tin chi tiết</h3>

        <div className="edit-layout">
          {/* Left column: image */}
          <div className="edit-image-col">
            {record.imageUrl ? (
              <img
                src={record.imageUrl}
                alt={record.name}
                className="edit-image"
              />
            ) : (
              <div className="edit-image edit-image--empty">
                <span>📷</span>
              </div>
            )}
          </div>

          {/* Right column: read-only info */}
          <div className="edit-form-col">
            <div className="detail-info-row">
              <span className="detail-info-label">Tên người trực</span>
              <span className="detail-info-value">{record.name}</span>
            </div>

            <div className="detail-info-row">
              <span className="detail-info-label">Ngày trực</span>
              <span className="detail-info-value">
                {dayOfWeek}, {formattedDate}
              </span>
            </div>

            {record.note && (
              <div className="detail-info-row">
                <span className="detail-info-label">Ghi chú</span>
                <span className="detail-info-value detail-info-value--note">
                  {record.note}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
