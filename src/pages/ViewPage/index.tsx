import { useState } from "react";
import { useRecords } from "../../hooks/useRecords";
import DayGroup from "../../components/DayGroup";
import { exportRecordsToCsv } from "../../utils/exportCsv";

export default function ViewPage() {
  const [search, setSearch] = useState("");
  const { records, loading, error } = useRecords();

  const searchLower = search.toLowerCase().trim();
  const filteredRecords = searchLower
    ? records.filter((r) => r.name.toLowerCase().includes(searchLower))
    : records;

  const grouped = filteredRecords.reduce<Record<string, typeof records>>(
    (acc, r) => {
      (acc[r.date] ??= []).push(r);
      return acc;
    },
    {}
  );

  return (
    <div className="page view-page">
      <h1>📋 Lịch Trực Nhật</h1>
      <p className="subtitle">Danh sách người trực theo ngày</p>

      {loading && <p className="loading">⏳ Đang tải...</p>}
      {error && <p className="msg err">{error}</p>}

      {!loading && (
        <div className="view-actions">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {records.length > 0 && (
            <button
              className="btn-export"
              onClick={() => exportRecordsToCsv(records)}
              title="Xuất CSV"
            >
              📥 Xuất CSV
            </button>
          )}
        </div>
      )}

      {!loading && !error && Object.keys(grouped).length === 0 && (
        <div className="card empty">
          <p>
            {search
              ? "🔍 Không tìm thấy kết quả."
              : "📭 Chưa có lịch trực nào được điểm danh."}
          </p>
        </div>
      )}

      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => (
          <DayGroup key={date} date={date} records={items} viewOnly />
        ))}
    </div>
  );
}
