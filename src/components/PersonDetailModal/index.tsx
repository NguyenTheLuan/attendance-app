import type { AttendanceRecord } from "~/types";

interface PersonDetailModalProps {
  record: AttendanceRecord;
  onClose: () => void;
}

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
      <div
        className="modal modal-person-detail"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          ✕
        </button>

        <div className="person-detail-layout">
          {record.imageUrl && (
            <div className="person-detail-image-col">
              <img
                src={record.imageUrl}
                alt={record.name}
                className="person-detail-image"
              />
            </div>
          )}

          <div className="person-detail-info-col">
            <h3 className="person-detail-name">{record.name}</h3>

            <div className="person-detail-info-row">
              <span className="person-detail-label">Ngày trực</span>
              <span className="person-detail-value">
                {dayOfWeek}, {formattedDate}
              </span>
            </div>

            {record.note && (
              <div className="person-detail-info-row">
                <span className="person-detail-label">Ghi chú</span>
                <span className="person-detail-value note-text">
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
