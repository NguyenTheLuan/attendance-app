import type { AttendanceRecord } from "~/types";
import PersonCard from "~/components/PersonCard";
import "./styles.css";

interface DayGroupProps {
  date: string;
  records: AttendanceRecord[];
  viewOnly: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (record: AttendanceRecord) => void;
  initialOpen?: boolean;
}

export default function DayGroup({
  date,
  records,
  viewOnly,
  onDelete,
  onEdit,
  initialOpen = true,
}: DayGroupProps) {
  const d = new Date(date + "T00:00:00");
  const dayOfWeek = d.toLocaleDateString("vi-VN", { weekday: "long" });
  const formattedDate = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const summary = `${dayOfWeek}, ${formattedDate} — ${records.length} người`;

  return (
    <details className="day-group" open={initialOpen}>
      <summary className="day-summary">{summary}</summary>
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
