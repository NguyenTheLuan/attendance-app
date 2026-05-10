import { useState, useEffect, useCallback } from "react";
import { getAllRecords } from "../db";
import type { AttendanceRecord } from "../types";

function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export default function ViewPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getAllRecords();
      setRecords(data);
    } catch {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = records.reduce<Record<string, AttendanceRecord[]>>(
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

      {!loading && !error && Object.keys(grouped).length === 0 && (
        <div className="card empty">
          <p>📭 Chưa có lịch trực nào được điểm danh.</p>
        </div>
      )}

      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => (
          <div key={date} className="card day-group">
            <h3 className="day-title">📌 {formatDate(date)}</h3>
            <div className="grid">
              {items.map((r) => (
                <div key={r.id} className="person-card view-card">
                  <img src={r.imageUrl} alt={r.name} />
                  <p>{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
