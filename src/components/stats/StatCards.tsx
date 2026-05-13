interface StatCardsProps {
  totalRecords: number;
  uniquePeople: number;
  totalMonths: number;
}

export default function StatCards({
  totalRecords,
  uniquePeople,
  totalMonths,
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
    </div>
  );
}
