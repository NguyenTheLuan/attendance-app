import type { AttendanceRecord } from "../types";
import PersonCard from "./PersonCard";

interface DayGroupProps {
  date: string;
  records: AttendanceRecord[];
  onDelete?: (id: string) => void;
  viewOnly?: boolean;
}

function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export default function DayGroup({
  date,
  records,
  onDelete,
  viewOnly = false,
}: DayGroupProps) {
  return (
    <div className="card day-group">
      <h3 className="day-title">📌 {formatDate(date)}</h3>
      <div className="grid">
        {records.map((r) => (
          <PersonCard
            key={r.id}
            record={r}
            onDelete={onDelete}
            viewOnly={viewOnly}
          />
        ))}
      </div>
    </div>
  );
}
