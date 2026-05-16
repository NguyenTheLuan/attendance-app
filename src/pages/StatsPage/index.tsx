import { useMemo, useState, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecords } from "~/hooks/useRecords";
import StatCards from "~/components/stats/StatCards";
import MonthList from "~/components/stats/MonthList";
import MonthDetail from "~/components/stats/MonthDetail";
import PeopleDetail from "~/components/stats/PeopleDetail";
import PersonDetailModal from "~/components/PersonDetailModal";
import Card from "~/components/Card";
import CardGroup from "~/components/CardGroup";
import DayGroup from "~/components/DayGroup";
import { isAbsentNote } from "~/utils/absence";
import { exportRecordsToCsv } from "~/utils/exportCsv";
import { groupByDate } from "~/utils/groupByDate";
import { getMonthlyDailyData } from "~/utils/weeklyCounts";
import type { AttendanceRecord } from "~/types";
import "~/pages/StatsPage/styles.css";

const MonthOverviewChart = lazy(
  () => import("~/components/stats/MonthOverviewChart")
);
const WeeklyChart = lazy(() => import("~/components/stats/WeeklyChart"));

interface StatsPageProps {
  isLoggedIn: boolean;
}

type ViewMode =
  | "month-compare"
  | "weekly"
  | "people"
  | "absences"
  | "incidents";

const ABSENCE_PASSWORD = "111";

export default function StatsPage({ isLoggedIn }: StatsPageProps) {
  const { records, loading, error } = useRecords();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get("mode") as ViewMode) || "month-compare"
  );
  const [viewDetailRecord, setViewDetailRecord] =
    useState<AttendanceRecord | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    undefined
  );

  const [absencePassword, setAbsencePassword] = useState("");
  const [absenceUnlocked, setAbsenceUnlocked] = useState(false);
  const [absencePasswordError, setAbsencePasswordError] = useState("");
  const [absenceSearch, setAbsenceSearch] = useState("");
  const [absenceMonthFilter, setAbsenceMonthFilter] = useState("");

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

  const absencesCount = useMemo(
    () => records.filter((r) => isAbsentNote(r.note)).length,
    [records]
  );

  const incidentDays = useMemo(() => {
    const daysWithNotes = new Set(
      records
        .filter((r) => r.note?.trim() && !isAbsentNote(r.note))
        .map((r) => r.date)
    );
    return daysWithNotes.size;
  }, [records]);

  const incidentsDetail = useMemo(() => {
    if (viewMode !== "incidents") return [];
    const filtered = records.filter(
      (r) => r.note?.trim() && !isAbsentNote(r.note)
    );
    return groupByDate(filtered);
  }, [records, viewMode]);

  const uniquePeople = useMemo(
    () => new Set(records.map((r) => r.name)).size,
    [records]
  );

  const monthDetail = useMemo(() => {
    if (!selectedMonth) return [];
    const filtered = records.filter((r) => r.date.startsWith(selectedMonth));
    return groupByDate(filtered);
  }, [records, selectedMonth]);

  const dailyData = useMemo(() => {
    if (!selectedMonth) return [];
    return getMonthlyDailyData(records, selectedMonth);
  }, [records, selectedMonth]);

  // --- Absence tab data ---
  const absenceMonths = useMemo(() => {
    const set = new Set<string>();
    for (const r of records) {
      if (isAbsentNote(r.note)) {
        set.add(r.date.slice(0, 7));
      }
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [records]);

  const filteredAbsences = useMemo(() => {
    let result = records.filter((r) => isAbsentNote(r.note));

    if (absenceMonthFilter) {
      result = result.filter((r) => r.date.startsWith(absenceMonthFilter));
    }

    if (absenceSearch.trim()) {
      const q = absenceSearch.toLowerCase().trim();
      result = result.filter((r) => r.name.toLowerCase().includes(q));
    }

    return groupByDate(result);
  }, [records, absenceMonthFilter, absenceSearch]);

  const activeCard = useMemo(() => {
    if (viewMode === "people") return "people" as const;
    if (viewMode === "incidents") return "incident" as const;
    if (viewMode === "month-compare" || viewMode === "weekly")
      return "total" as const;
    return null;
  }, [viewMode]);

  // --- Sync viewMode to URL ---

  function updateViewMode(mode: ViewMode) {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams);
    if (mode === "month-compare") {
      params.delete("mode");
    } else {
      params.set("mode", mode);
    }
    setSearchParams(params, { replace: true });
  }

  // --- Handlers for stat card clicks ---

  function handleTotalDutyClick() {
    updateViewMode("month-compare");
    setSelectedMonth(undefined);
  }

  function handleUniquePeopleClick() {
    updateViewMode("people");
    setSelectedMonth(undefined);
  }

  function handleIncidentClick() {
    updateViewMode(viewMode === "incidents" ? "month-compare" : "incidents");
    setSelectedMonth(undefined);
  }

  function handleSwitchToAbsences() {
    updateViewMode("absences");
    setAbsenceUnlocked(false);
    setAbsencePassword("");
    setAbsencePasswordError("");
    setAbsenceSearch("");
    setAbsenceMonthFilter("");
  }

  function handleAbsencePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (absencePassword === ABSENCE_PASSWORD) {
      setAbsenceUnlocked(true);
      setAbsencePasswordError("");
    } else {
      setAbsencePasswordError("❌ Sai mật khẩu");
    }
  }

  return (
    <div className="page stats-page">
      <h1>📊 Thống kê lịch trực khu phố 3 - 6</h1>

      {loading && <p className="loading">⏳ Đang tải...</p>}
      {error && <p className="msg err">{error}</p>}

      {!loading && !error && (
        <>
          <StatCards
            activeCard={activeCard}
            totalRecords={records.length}
            uniquePeople={uniquePeople}
            totalMonths={monthList.length}
            incidentDays={incidentDays}
            onTotalDutyClick={handleTotalDutyClick}
            onUniquePeopleClick={handleUniquePeopleClick}
            onIncidentClick={handleIncidentClick}
          />

          {/* Incident / Special days section */}
          {viewMode === "incidents" && (
            <>
              {incidentsDetail.length === 0 ? (
                <Card>
                  <p className="empty">Không có ngày đặc biệt nào.</p>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="incident-header">
                      <h2>⭐ Ngày đặc biệt</h2>
                      <button
                        className="btn-close-incident"
                        onClick={() => setViewMode("month-compare")}
                      >
                        ✕
                      </button>
                    </div>
                  </Card>
                  <div className="view-scroll-content">
                    {incidentsDetail.map(([date, items]) => {
                      const d = new Date(date + "T00:00:00");
                      const dayOfWeek = d.toLocaleDateString("vi-VN", {
                        weekday: "long",
                      });
                      const formattedDate = d.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                      const title = `${dayOfWeek}, ${formattedDate} — ${items.length} người`;
                      return (
                        <CardGroup
                          key={date}
                          title={title}
                          records={items}
                          onViewDetail={setViewDetailRecord}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* People detail view */}
          {viewMode === "people" && <PeopleDetail records={records} />}

          {isLoggedIn && records.length > 0 && (
            <div className="stats-export-row">
              <button
                className="btn-export"
                onClick={() => exportRecordsToCsv(records)}
              >
                📥 Xuất CSV
              </button>
            </div>
          )}

          {/* View mode toggle — hidden in people / incidents mode */}
          {viewMode !== "people" && viewMode !== "incidents" && (
            <div className="chart-tabs">
              <button
                className={`chart-tab ${
                  viewMode === "month-compare" ? "active" : ""
                }`}
                onClick={() => {
                  setViewMode("month-compare");
                  setSelectedMonth(undefined);
                }}
              >
                📈 So sánh theo tháng
              </button>
              <button
                className={`chart-tab ${viewMode === "weekly" ? "active" : ""}`}
                onClick={() => {
                  setViewMode("weekly");
                  setSelectedMonth(undefined);
                }}
              >
                🗓️ Theo từng tháng
              </button>
              {isLoggedIn && (
                <button
                  className={`chart-tab ${
                    viewMode === "absences" ? "active" : ""
                  }`}
                  onClick={handleSwitchToAbsences}
                >
                  📝 Số lần vắng ({absencesCount})
                </button>
              )}
            </div>
          )}

          {viewMode === "month-compare" && monthList.length > 0 && (
            <Suspense
              fallback={
                <div className="card empty">
                  <p>⏳ Đang tải biểu đồ...</p>
                </div>
              }
            >
              <MonthOverviewChart months={monthList} records={records} />
            </Suspense>
          )}

          {viewMode === "weekly" && (
            <>
              <MonthList
                months={monthList}
                onSelectMonth={setSelectedMonth}
                selectedMonth={selectedMonth}
              />

              {selectedMonth && dailyData.length > 0 && (
                <Suspense
                  fallback={
                    <div className="card empty">
                      <p>⏳ Đang tải biểu đồ...</p>
                    </div>
                  }
                >
                  <WeeklyChart
                    dailyData={dailyData}
                    monthLabel={selectedMonth}
                  />
                </Suspense>
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
              onViewDetail={setViewDetailRecord}
            />
          )}

          {/* Absence tab */}
          {viewMode === "absences" && (
            <div className="card">
              {!absenceUnlocked ? (
                <div className="absence-prompt">
                  <h2>🔒 Nhập mật khẩu để xem</h2>
                  <form
                    onSubmit={handleAbsencePasswordSubmit}
                    className="absence-password-form"
                  >
                    <input
                      type="password"
                      className="absence-password-input"
                      placeholder="Nhập mật khẩu..."
                      value={absencePassword}
                      onChange={(e) => {
                        setAbsencePassword(e.target.value);
                        setAbsencePasswordError("");
                      }}
                      autoFocus
                    />
                    <button type="submit" className="btn-primary">
                      Xác nhận
                    </button>
                  </form>
                  {absencePasswordError && (
                    <p className="msg err">{absencePasswordError}</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="absence-header">
                    <h2>📝 Chi tiết vắng mặt</h2>
                    <span className="absence-total">
                      Tổng: <strong>{absencesCount}</strong> lượt
                    </span>
                  </div>

                  <div className="absence-filters">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="🔍 Tìm theo tên..."
                      value={absenceSearch}
                      onChange={(e) => setAbsenceSearch(e.target.value)}
                    />
                    {absenceMonths.length > 0 && (
                      <select
                        className="month-select"
                        value={absenceMonthFilter}
                        onChange={(e) => setAbsenceMonthFilter(e.target.value)}
                      >
                        <option value="">Tất cả tháng</option>
                        {absenceMonths.map((m) => {
                          const [y, mo] = m.split("-");
                          return (
                            <option key={m} value={m}>
                              Tháng {parseInt(mo, 10)}/{y}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>

                  {filteredAbsences.length === 0 && (
                    <div className="card empty">
                      <p>Không tìm thấy kết quả.</p>
                    </div>
                  )}

                  {filteredAbsences.length > 0 && (
                    <div className="month-detail-list">
                      {filteredAbsences.map(([date, items]) => (
                        <DayGroup
                          key={date}
                          date={date}
                          records={items}
                          viewOnly
                          hideImages
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Person detail modal (shown when a record image is clicked) */}
      {viewDetailRecord && (
        <PersonDetailModal
          record={viewDetailRecord}
          onClose={() => setViewDetailRecord(null)}
        />
      )}
    </div>
  );
}
