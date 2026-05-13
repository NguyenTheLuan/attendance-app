import { formatMonth } from "~/utils/formatDate";
import type { MonthStats } from "~/types";

interface MonthListProps {
  months: MonthStats[];
  onSelectMonth: (month: string) => void;
}

export default function MonthList({ months, onSelectMonth }: MonthListProps) {
  return (
    <div className="card">
      <h2>🗓️ Các tháng</h2>
      <div className="month-list">
        {months.map((m) => (
          <div
            key={m.month}
            className="month-item clickable"
            onClick={() => onSelectMonth(m.month)}
          >
            <span className="month-name">{formatMonth(m.month)}</span>
            <span className="month-count">{m.totalDuty} lượt</span>
            <span className="month-people">{m.uniquePeople} người</span>
          </div>
        ))}
      </div>
    </div>
  );
}
