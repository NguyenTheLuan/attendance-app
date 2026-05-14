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
        {dayOfWeek}, {formattedDate} — {records.length} người
      </summary>
      <div className="person-grid">
        {records.map((record) => (
          <PersonCard
            key={record.id}
            record={record}
            viewOnly={viewOnly}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </details>
  );
}
