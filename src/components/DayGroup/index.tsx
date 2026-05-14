import { useState } from "react";
import type { AttendanceRecord } from "~/types";

interface DayGroupProps {
  date: string;
  records: AttendanceRecord[];
  viewOnly: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (record: AttendanceRecord) => void;
}

export default function DayGroup({
  date,
  records,
  viewOnly,
  onDelete,
  onEdit,
}: DayGroupProps) {
  const [expanded, setExpanded] = useState(false);

  const d = new Date(date + "T00:00:00");
  const dayOfWeek = d.toLocaleDateString("vi-VN", { weekday: "long" });
  const formattedDate = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <details className="day-group" open>
      <summary className="day-summary">
        <span>
          {dayOfWeek}, {formattedDate}
        </span>
        <span className="day-count">{records.length} người</span>
      </summary>
      <div className="person-grid">
        {records.map((record) => (
          <PersonCard
            key={record.id}
            record={record}
            viewOnly={viewOnly}
            onEdit={onEdit}
          />
        ))}
      </div>
    </details>
  );
}

function PersonCard({
  record,
  viewOnly,
  onEdit,
}: {
  record: AttendanceRecord;
  viewOnly: boolean;
  onEdit?: (record: AttendanceRecord) => void;
}) {
  const [imgError, setImgError] = useState(false);

  function handleClick() {
    if (!viewOnly && onEdit) {
      onEdit(record);
    }
  }

  return (
    <div className="person-card card">
      <div
        className="person-avatar"
        onClick={handleClick}
        style={{ cursor: viewOnly ? "default" : "pointer" }}
      >
        {imgError || !record.imageUrl ? (
          <div className="person-avatar-fallback">👤</div>
        ) : (
          <img
            src={record.imageUrl}
            alt={record.name}
            className="person-img"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="person-info">
        <strong className="person-name">{record.name}</strong>
        {record.note && <p className="person-note">{record.note}</p>}
      </div>
    </div>
  );
}
