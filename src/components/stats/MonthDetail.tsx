import DayGroup from "~/components/DayGroup";
import type { AttendanceRecord } from "~/types";
import "./MonthDetail.css";

interface MonthDetailProps {
  selectedMonth: string;
  monthDetail: [string, AttendanceRecord[]][];
  onViewDetail?: (record: AttendanceRecord) => void;
}

export default function MonthDetail({
  selectedMonth,
  monthDetail,
  onViewDetail,
}: MonthDetailProps) {
  return (
    <div className="card">
      <h2>📊 Chi tiết tháng {selectedMonth}</h2>
      <div className="month-detail-list">
        {monthDetail.map(([date, items]) => (
          <DayGroup
            key={date}
            date={date}
            records={items}
            viewOnly
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </div>
  );
}
