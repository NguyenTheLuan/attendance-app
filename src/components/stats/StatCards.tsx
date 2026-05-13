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
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-number">{totalRecords}</span>
        <span className="stat-label">Tổng lượt trực</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{uniquePeople}</span>
        <span className="stat-label">Người đã trực</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{totalMonths}</span>
        <span className="stat-label">Tháng có dữ liệu</span>
      </div>
    </div>
  );
}
