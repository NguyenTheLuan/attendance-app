import type { AttendanceRecord } from "~/types";
import PersonCard from "~/components/PersonCard";
import { formatDate } from "~/utils/formatDate";

interface DayGroupProps {
  date: string;
  records: AttendanceRecord[];
  onDelete?: (id: string) => void;
  onEdit?: (record: AttendanceRecord) => void;
  viewOnly?: boolean;
}

export default function DayGroup({
  date,
  records,
  onDelete,
  onEdit,
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
            onEdit={onEdit}
            viewOnly={viewOnly}
          />
        ))}
      </div>
    </div>
  );
}
