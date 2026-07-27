import { useState } from "react";
import type { AttendanceRecord } from "~/types";
import PersonCard from "~/components/PersonCard";
import "./styles.css";

interface DayGroupProps {
  date: string;
  records: AttendanceRecord[];
  viewOnly: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (record: AttendanceRecord) => void;
  onViewDetail?: (record: AttendanceRecord) => void;
  initialOpen?: boolean;
}

// Extract initials for avatars
function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DayGroup({
  date,
  records,
  viewOnly,
  onDelete,
  onEdit,
  onViewDetail,
  initialOpen = true,
}: DayGroupProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const d = new Date(date + "T00:00:00");
  const dayOfWeek = d.toLocaleDateString("vi-VN", { weekday: "long" });
  const formattedDate = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const displayRecords = records.slice(0, 4); // Max 4 avatars in stack
  const extraCount = records.length - 4;

  return (
    <div className={`day-group-item ${isOpen ? "expanded" : ""}`}>
      <div className="day-group-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="day-info">
          <div className="day-date">{formattedDate}</div>
          <div className="day-weekday">{dayOfWeek}</div>
        </div>
        
        {!isOpen && (
          <div className="avatar-stack">
            {displayRecords.map((r, idx) => (
              <div 
                key={r.id} 
                className="avatar"
                style={{ 
                  zIndex: 10 - idx,
                  backgroundColor: `var(--chart-${(idx % 8) + 1})`
                }}
              >
                {getInitials(r.name)}
              </div>
            ))}
            {extraCount > 0 && (
              <div className="avatar extra-avatar" style={{ zIndex: 0 }}>
                +{extraCount}
              </div>
            )}
          </div>
        )}

        <span className="count-badge">{records.length} người</span>
        <span className="chevron">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="person-cards">
          {records.map((record) => (
            <PersonCard
              key={record.id}
              record={record}
              viewOnly={viewOnly}
              onDelete={onDelete}
              onEdit={onEdit}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
