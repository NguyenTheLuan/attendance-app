import { useMemo, useState } from "react";
import { useRecords } from "../hooks/useRecords";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#e94560",
  "#0f3460",
  "#533483",
  "#e94560",
  "#16213e",
  "#1a1a2e",
  "#ff6b81",
  "#7bed9f",
  "#70a1ff",
  "#ffa502",
  "#2ed573",
  "#ff4757",
];

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `Tháng ${parseInt(m)}/${y}`;
}

function formatDateShort(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${parseInt(d)}/${parseInt(m)}`;
}

// Aggregate daily counts grouped by week for a single month
function getWeeklyDailyCounts(
  records: { date: string; name: string }[],
  monthKey: string
) {
  const monthRecords = records.filter((r) => r.date.startsWith(monthKey));
  const dayCounts = new Map<string, number>();
  for (const r of monthRecords) {
    dayCounts.set(r.date, (dayCounts.get(r.date) ?? 0) + 1);
  }

  // Determine weeks
  const year = parseInt(monthKey.split("-")[0]);
  const month = parseInt(monthKey.split("-")[1]) - 1;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get ISO week number
  function getWeekNumber(d: Date) {
    const temp = new Date(d.valueOf());
    const dayNum = (temp.getDay() + 6) % 7;
    temp.setDate(temp.getDate() - dayNum + 3);
    const firstThursday = temp.valueOf();
    temp.setMonth(0, 1);
    if (temp.getDay() !== 4) {
      temp.setMonth(0, 1 + ((4 - temp.getDay() + 7) % 7));
    }
    return Math.ceil((firstThursday - temp.valueOf()) / 604800000) + 1;
  }

  // Group days by week number (relative)
  const weekGroups = new Map<
    number,
    { label: string; data: { day: string; count: number }[] }
  >();

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(year, month, d);
    const ymd = `${monthKey}-${String(d).padStart(2, "0")}`;
    const wn = getWeekNumber(dateObj);
    if (!weekGroups.has(wn)) {
      const weekNum = weekGroups.size + 1;
      weekGroups.set(wn, { label: `Tuần ${weekNum}`, data: [] });
    }
    weekGroups.get(wn)!.data.push({
      day: `${parseInt(String(d))}/${parseInt(monthKey.split("-")[1])}`,
      count: dayCounts.get(ymd) ?? 0,
    });
  }

  return Array.from(weekGroups.values());
}

export default function StatsPage() {
  const { records, loading, error } = useRecords();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Person frequency (always computed from all records for pie chart)
  const personData = useMemo(() => {
    const count = new Map<string, number>();
    for (const r of records) {
      count.set(r.name, (count.get(r.name) ?? 0) + 1);
    }
    return Array.from(count.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  // Monthly stats
  const monthStats = useMemo(() => {
    const monthMap = new Map<string, Set<string>>();
    for (const r of records) {
      const mk = r.date.slice(0, 7);
      if (!monthMap.has(mk)) monthMap.set(mk, new Set());
      monthMap.get(mk)!.add(r.name);
    }
    return Array.from(monthMap.entries())
      .map(([month, names]) => ({
        month,
        totalDuty: records.filter((r) => r.date.startsWith(month)).length,
        uniquePeople: names.size,
        names: Array.from(names).sort(),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  // Line chart data
  const lineChartData = useMemo(() => {
    if (selectedMonth) {
      // Single month: weekly comparison
      return getWeeklyDailyCounts(records, selectedMonth);
    } else {
      // Multi-month: monthly comparison
      return monthStats.map((m) => ({
        label: formatMonth(m.month),
        month: m.month,
        "Lượt trực": m.totalDuty,
      }));
    }
  }, [records, monthStats, selectedMonth]);

  // Detailed view for selected month
  const monthDetail = useMemo(() => {
    if (!selectedMonth) return null;
    const dayRecords = records.filter((r) => r.date.startsWith(selectedMonth));
    const grouped = dayRecords.reduce<Record<string, typeof dayRecords>>(
      (acc, r) => {
        (acc[r.date] ??= []).push(r);
        return acc;
      },
      {}
    );
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }, [records, selectedMonth]);

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
  if (records.length === 0)
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

      {/* Overview cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{records.length}</span>
          <span className="stat-label">Tổng lượt trực</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {new Set(records.map((r) => r.name)).size}
          </span>
          <span className="stat-label">Người đã trực</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{monthStats.length}</span>
          <span className="stat-label">Tháng có dữ liệu</span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="card chart-card">
        <h2>
          {selectedMonth
            ? `📈 Chi tiết ${formatMonth(selectedMonth)}`
            : "📈 Xu hướng theo tháng"}
        </h2>
        <div className="chart-month-select">
          <button
            className={`chart-month-btn${!selectedMonth ? " active" : ""}`}
            onClick={() => setSelectedMonth(null)}
          >
            📊 Tổng quan
          </button>
          {monthStats.map((m) => (
            <button
              key={m.month}
              className={`chart-month-btn${
                selectedMonth === m.month ? " active" : ""
              }`}
              onClick={() => setSelectedMonth(m.month)}
            >
              {formatMonth(m.month)}
            </button>
          ))}
        </div>

        {selectedMonth ? (
          // Weekly breakdown for single month
          (lineChartData as ReturnType<typeof getWeeklyDailyCounts>).map(
            (week) => (
              <div key={week.label} className="week-chart">
                <h3 className="week-label">{week.label}</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={week.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#e94560"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Lượt trực"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          )
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={
                lineChartData as {
                  label: string;
                  month: string;
                  "Lượt trực": number;
                }[]
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Lượt trực"
                stroke="#e94560"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart: Person distribution */}
      <div className="card chart-card">
        <h2>🧑‍🤝‍🧑 So sánh người trực</h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={personData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {personData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Month detail when selected */}
      {selectedMonth && monthDetail && (
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
      )}

      {/* Month list */}
      {!selectedMonth && (
        <div className="card">
          <h2>🗓️ Các tháng</h2>
          <div className="month-list">
            {monthStats.map((m) => (
              <div
                key={m.month}
                className="month-item clickable"
                onClick={() => setSelectedMonth(m.month)}
              >
                <span className="month-name">{formatMonth(m.month)}</span>
                <span className="month-count">{m.totalDuty} lượt</span>
                <span className="month-people">{m.uniquePeople} người</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
