interface StatCardsProps {
  totalRecords: number;
  uniquePeople: number;
  totalMonths: number;
  incidentDays: number;
  onIncidentClick?: () => void;
}

export default function StatCards({
  totalRecords,
  uniquePeople,
  totalMonths,
  incidentDays,
  onIncidentClick,
}: StatCardsProps) {
  return (
    <div className="stat-cards">
      <div className="stat-card">
        <span className="stat-num">{totalRecords}</span>
        <span className="stat-label">Tổng lượt trực</span>
      </div>
      <div className="stat-card">
        <span className="stat-num">{uniquePeople}</span>
        <span className="stat-label">Người đã trực</span>
      </div>
      <div className="stat-card">
        <span className="stat-num">{totalMonths}</span>
        <span className="stat-label">Tháng</span>
      </div>
      <div
        className={`stat-card${onIncidentClick ? " clickable-card" : ""}`}
        onClick={onIncidentClick}
      >
        <span className="stat-num">{incidentDays}</span>
        <span className="stat-label">Ngày đặc biệt</span>
      </div>
    </div>
  );
}
