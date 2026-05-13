import { useMemo, useState } from "react";
import { useRecords } from "../../hooks/useRecords";
import StatCards from "../../components/stats/StatCards";
import MonthList from "../../components/stats/MonthList";
import MonthDetail from "../../components/stats/MonthDetail";
import MonthOverviewChart from "../../components/stats/MonthOverviewChart";
import PieChartSection from "../../components/stats/PieChartSection";
import WeeklyChart, {
  getWeeklyDailyCounts,
} from "../../components/stats/WeeklyChart";
import { exportRecordsToCsv } from "../../utils/exportCsv";

export default function StatsPage() {
  const { records, loading, error } = useRecords();
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
      .sort((a, b) => b.month.localeCompare(a.month));
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
      <h1>📊 Thống Kê Trực Nhật</h1>

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

          {monthList.length > 0 && <MonthOverviewChart months={monthList} />}

          <div className="stats-content">
            <MonthList months={monthList} onSelectMonth={setSelectedMonth} />

            {selectedMonth && (
              <>
                <WeeklyChart weeks={weeks} />
                <MonthDetail
                  selectedMonth={selectedMonth}
                  monthDetail={monthDetail}
                />
              </>
            )}
          </div>

          {pieData.length > 0 && <PieChartSection data={pieData} />}
        </>
      )}
    </div>
  );
}
