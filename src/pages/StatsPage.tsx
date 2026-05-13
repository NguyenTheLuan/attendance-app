import { useMemo } from "react";
import { useRecords } from "../hooks/useRecords";

export default function StatsPage() {
  const { records, loading, error } = useRecords();

  const stats = useMemo(() => {
    if (records.length === 0) return null;

    // Group by month
    const monthMap = new Map<string, Set<string>>();

    for (const r of records) {
      const monthKey = r.date.slice(0, 7); // YYYY-MM
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, new Set());
      }
      monthMap.get(monthKey)!.add(r.name);
    }

    const months = Array.from(monthMap.entries())
      .map(([month, names]) => ({
        month,
        totalDuty: records.filter((r) => r.date.startsWith(month)).length,
        uniquePeople: names.size,
        names: Array.from(names).sort(),
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    // Current month vs previous month
    const thisMonth = months[0];
    const prevMonth = months[1];

    // Total unique people overall
    const allPeople = new Set(records.map((r) => r.name));

    // Total records
    const totalRecords = records.length;

    // Person frequency
    const personCount = new Map<string, number>();
    for (const r of records) {
      personCount.set(r.name, (personCount.get(r.name) ?? 0) + 1);
    }
    const topPeople = Array.from(personCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      months,
      thisMonth,
      prevMonth,
      allPeople: allPeople.size,
      totalRecords,
      topPeople,
    };
  }, [records]);

  if (loading)
    return (
      <div className="page">
        <p className="loading">⏳ Đang tải...</p>
      </div>
    );
  if (error)
    return (
      <div className="page">
        <p className="msg err">{error}</p>
      </div>
    );
  if (!stats)
    return (
      <div className="page">
        <div className="card empty">
          <p>📭 Chưa có dữ liệu thống kê.</p>
        </div>
      </div>
    );

  return (
    <div className="page stats-page">
      <h1>📊 Thống Kê</h1>
      <p className="subtitle">Tổng quan điểm danh trực nhật</p>

      {/* Overview cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.totalRecords}</span>
          <span className="stat-label">Tổng lượt trực</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.allPeople}</span>
          <span className="stat-label">Người đã trực</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.months.length}</span>
          <span className="stat-label">Tháng có dữ liệu</span>
        </div>
      </div>

      {/* Month comparison */}
      {stats.thisMonth && (
        <div className="card">
          <h2>📅 Tháng này ({stats.thisMonth.month})</h2>
          <div className="stat-row">
            <div>
              <strong>{stats.thisMonth.totalDuty}</strong> lượt trực
            </div>
            <div>
              <strong>{stats.thisMonth.uniquePeople}</strong> người
            </div>
          </div>
          <div className="name-tags">
            {stats.thisMonth.names.map((n) => (
              <span key={n} className="name-tag">
                {n}
              </span>
            ))}
          </div>
          {stats.prevMonth && (
            <>
              <hr className="stat-divider" />
              <h3>Tháng trước ({stats.prevMonth.month})</h3>
              <div className="stat-row">
                <div>
                  <strong>{stats.prevMonth.totalDuty}</strong> lượt trực
                  <span
                    className={`compare-badge ${
                      stats.thisMonth.totalDuty >= stats.prevMonth.totalDuty
                        ? "up"
                        : "down"
                    }`}
                  >
                    {stats.thisMonth.totalDuty >= stats.prevMonth.totalDuty
                      ? "📈"
                      : "📉"}
                  </span>
                </div>
                <div>
                  <strong>{stats.prevMonth.uniquePeople}</strong> người
                </div>
              </div>
              <div className="name-tags">
                {stats.prevMonth.names.map((n) => (
                  <span key={n} className="name-tag">
                    {n}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* All months */}
      <div className="card">
        <h2>🗓️ Các tháng</h2>
        <div className="month-list">
          {stats.months.map((m) => (
            <div key={m.month} className="month-item">
              <span className="month-name">{m.month}</span>
              <span className="month-count">{m.totalDuty} lượt</span>
              <span className="month-people">{m.uniquePeople} người</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top people */}
      <div className="card">
        <h2>🏆 Người trực nhiều nhất</h2>
        <div className="top-list">
          {stats.topPeople.map(([name, count], i) => (
            <div key={name} className="top-item">
              <span className="top-rank">{i + 1}</span>
              <span className="top-name">{name}</span>
              <span className="top-count">{count} lần</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
