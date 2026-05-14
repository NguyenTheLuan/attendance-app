import PersonCard from "~/components/PersonCard";
import { formatDate } from "~/utils/formatDate";
import type { AttendanceRecord } from "~/types";
import "../PersonCard/styles.css";
import "./MonthDetail.css";

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
      <h2>📊 Chi tiết tháng {selectedMonth}</h2>
      <div className="month-detail-list">
        {monthDetail.map(([date, items]) => (
          <div key={date} className="day-group">
            <button
              className="day-summary"
              onClick={() => {
                const detail = document.getElementById(`detail-${date}`);
                if (detail) {
                  detail.hidden = !detail.hidden;
                }
              }}
            >
              <span className="day-summary-left">
                <span className="day-summary-date">📅 {formatDate(date)}</span>
                <span className="day-summary-arrow">▼</span>
              </span>
              <span className="day-summary-right">
                <span className="day-summary-count">{items.length} người</span>
                <span className="day-summary-names">
                  {items.map((r) => r.name).join(", ")}
                </span>
              </span>
            </button>
            <div id={`detail-${date}`} className="person-grid">
              {items.map((r) => (
                <PersonCard key={r.id} record={r} viewOnly />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
