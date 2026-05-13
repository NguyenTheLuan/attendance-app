import PersonCard from "~/components/PersonCard";
import { formatDate } from "~/utils/formatDate";
import type { AttendanceRecord } from "~/types";

interface MonthDetailProps {
  selectedMonth: string;
  monthDetail: [string, AttendanceRecord[]][];
}

export default function MonthDetail({
  selectedMonth,
  monthDetail,
}: MonthDetailProps) {
  return (
    <div className="card">
      <h2>� Chi tiết tháng {selectedMonth}</h2>
      {monthDetail.map(([date, items]) => (
        <div key={date} className="day-group" style={{ marginBottom: 16 }}>
          <h3 className="day-title">📌 {formatDate(date)}</h3>
          <div className="grid">
            {items.map((r) => (
              <PersonCard key={r.id} record={r} viewOnly />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
