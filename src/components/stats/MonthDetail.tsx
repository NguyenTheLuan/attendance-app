import type { AttendanceRecord } from "../../types";
import { formatDateShort } from "../../utils/formatDate";
import { formatMonth } from "../../utils/formatDate";

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
      <h2>📅 Lịch trực {formatMonth(selectedMonth)}</h2>
      <div className="month-detail-list">
        {monthDetail.map(([date, items]) => (
          <div key={date} className="month-detail-day">
            <h3 className="day-title">📌 {formatDateShort(date)}</h3>
            <div className="month-detail-grid">
              {items.map((r) => (
                <div key={r.id} className="month-detail-person">
                  <img src={r.imageUrl} alt={r.name} loading="lazy" />
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
