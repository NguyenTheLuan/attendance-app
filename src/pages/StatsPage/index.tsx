import { useMemo, useState } from "react";
import { useRecords } from "~/hooks/useRecords";
import StatCards from "~/components/stats/StatCards";
import MonthList from "~/components/stats/MonthList";
import MonthDetail from "~/components/stats/MonthDetail";
import MonthOverviewChart from "~/components/stats/MonthOverviewChart";
import PieChartSection from "~/components/stats/PieChartSection";
import WeeklyChart, {
  getWeeklyDailyCounts,
} from "~/components/stats/WeeklyChart";
import { exportRecordsToCsv } from "~/utils/exportCsv";

type ViewMode = "month-compare" | "weekly";

export default function StatsPage() {
  const { records, loading, error } = useRecords();
  const [viewMode, setViewMode] = useState<ViewMode>("month-compare");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const monthList = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const r of records) {
      const m = r.date.slice(0, 7);
      if (!map.has(m)) map.set(m, new Set());
      map.get(m)!.add(r.name);
    }
    return Array.from(map.entries())
      .map(([month, names]) => ({
        month,
        totalDuty: records.filter((r) => r.date.startsWith(month)).length,
        uniquePeople: names.size,
        names: Array.from(names),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  const uniquePeople = useMemo(
    () => new Set(records.map((r) => r.name)).size,
    [records]
  );

  const monthDetail = useMemo(() => {
    if (!selectedMonth) return [];
    const grouped = records
      .filter((r) => r.date.startsWith(selectedMonth))
      .reduce<Record<string, typeof records>>((acc, r) => {
        (acc[r.date] ??= []).push(r);
        return acc;
      }, {});
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }, [records, selectedMonth]);

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) {
      map.set(r.name, (map.get(r.name) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  const weeks = useMemo(() => {
    if (!selectedMonth) return [];
    return getWeeklyDailyCounts(records, selectedMonth);
  }, [records, selectedMonth]);

  return (
    <div className="page stats-page">
      <h1>📊 Thống kê lịch trực khu phố 3 - 6</h1>

      {loading && <p className="loading">⏳ Đang tải...</p>}
      {error && <p className="msg err">{error}</p>}

      {!loading && !error && (
        <>
          <StatCards
            totalRecords={records.length}
            uniquePeople={uniquePeople}
            totalMonths={monthList.length}
          />

          {records.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <button
                className="btn-export"
                onClick={() => exportRecordsToCsv(records)}
              >
                📥 Xuất CSV
              </button>
            </div>
          )}

          {/* View mode toggle */}
          <div className="chart-tabs">
            <button
              className={`chart-tab ${
                viewMode === "month-compare" ? "active" : ""
              }`}
              onClick={() => {
                setViewMode("month-compare");
                setSelectedMonth(null);
              }}
            >
              📈 So sánh theo tháng
            </button>
            <button
              className={`chart-tab ${viewMode === "weekly" ? "active" : ""}`}
              onClick={() => {
                setViewMode("weekly");
                setSelectedMonth(null);
              }}
            >
              🗓️ Theo tuần
            </button>
          </div>

          {viewMode === "month-compare" && monthList.length > 0 && (
            <MonthOverviewChart months={monthList} />
          )}

          {viewMode === "weekly" && (
            <>
              <MonthList months={monthList} onSelectMonth={setSelectedMonth} />

              {selectedMonth && weeks.length > 0 && (
                <WeeklyChart weeks={weeks} />
              )}

              {selectedMonth && monthDetail.length === 0 && (
                <div className="card empty">
                  <p>Chưa có dữ liệu trực cho tháng này.</p>
                </div>
              )}
            </>
          )}

          {selectedMonth && viewMode === "weekly" && monthDetail.length > 0 && (
            <MonthDetail
              selectedMonth={selectedMonth}
              monthDetail={monthDetail}
            />
          )}

          {viewMode === "month-compare" && pieData.length > 0 && (
            <PieChartSection data={pieData} />
          )}
        </>
      )}
    </div>
  );
}
