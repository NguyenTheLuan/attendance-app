import { useState, useMemo } from "react";
import { useRecords } from "~/hooks/useRecords";
import DayGroup from "~/components/DayGroup";
import EditModal from "~/components/EditModal";
import ConfirmDialog from "~/components/ConfirmDialog";
import Toast from "~/components/Toast";
import PersonDetailModal from "~/components/PersonDetailModal";
import { isAbsentNote } from "~/utils/absence";
import { exportRecordsToCsv } from "~/utils/exportCsv";
import { groupByDate } from "~/utils/groupByDate";
import { deleteRecordById, updateRecordById } from "~/services/db";
import type { AttendanceRecord } from "~/types";
import "~/pages/ViewPage/styles.css";

interface ViewPageProps {
  isLoggedIn: boolean;
}

type ViewMode = "all" | "month";

export default function ViewPage({ isLoggedIn }: ViewPageProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewDetailRecord, setViewDetailRecord] =
    useState<AttendanceRecord | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");
  const { records, loading, error, load } = useRecords();

  // Get available months from records
  const months = useMemo(() => {
    const set = new Set<string>();
    for (const r of records) {
      const m = r.date.slice(0, 7); // "YYYY-MM"
      set.add(m);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [records]);

  // Auto-select first month when switching to month view
  const currentMonth = useMemo(() => {
    if (viewMode === "month") {
      return selectedMonth || months[0] || "";
    }
    return "";
  }, [viewMode, selectedMonth, months]);

  const searchLower = search.toLowerCase().trim();

  const filteredRecords = useMemo(() => {
    let result = records;

    // Hide absent records from non-logged-in users
    if (!isLoggedIn) {
      result = result.filter((r) => !isAbsentNote(r.note));
    }

    // Filter by month
    if (viewMode === "month" && currentMonth) {
      result = result.filter((r) => r.date.startsWith(currentMonth));
    }

    // Filter by search
    if (searchLower) {
      result = result.filter((r) => r.name.toLowerCase().includes(searchLower));
    }

    return result;
  }, [records, isLoggedIn, viewMode, currentMonth, searchLower]);

  const groupedEntries = groupByDate(filteredRecords);
  const grouped = Object.fromEntries(groupedEntries);

  function handleDeleteClick(id: string) {
    setDeleteTargetId(id);
  }

  function showToastMsg(message: string, type: "success" | "error") {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteRecordById(deleteTargetId);
      await load();
      setDeleteTargetId(null);
      showToastMsg("Đã xóa thành công!", "success");
    } catch {
      showToastMsg("Lỗi khi xóa. Thử lại nhé.", "error");
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdate(data: {
    name: string;
    date: string;
    imageUrl?: string;
    note?: string;
  }) {
    if (!editingRecord) return;
    try {
      await updateRecordById(editingRecord.id, data);
      await load();
      setEditingRecord(null);
      showToastMsg("Đã lưu thành công!", "success");
    } catch {
      showToastMsg("Lỗi khi lưu. Thử lại nhé.", "error");
    }
  }

  return (
    <div className="page view-page">
      <h1>Xem Khu phố 3 - 6</h1>
      <p className="subtitle">Danh sách người trực theo ngày</p>

      {loading && <p className="loading">⏳ Đang tải...</p>}
      {error && <p className="msg err">{error}</p>}

      {!loading && (
        <div className="view-sticky-header">
          <div className="view-mode-tabs">
            <button
              className={`view-mode-tab ${viewMode === "all" ? "active" : ""}`}
              onClick={() => setViewMode("all")}
            >
              📋 Tất cả
            </button>
            <button
              className={`view-mode-tab ${
                viewMode === "month" ? "active" : ""
              }`}
              onClick={() => {
                setViewMode("month");
                if (!selectedMonth && months[0]) setSelectedMonth(months[0]);
              }}
            >
              📅 Theo tháng
            </button>
          </div>

          {viewMode === "month" && months.length > 0 && (
            <div className="month-select-row">
              <select
                className="month-select"
                value={currentMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((m) => {
                  const [y, mo] = m.split("-");
                  const label = `Tháng ${parseInt(mo, 10)}/${y}`;
                  return (
                    <option key={m} value={m}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="view-actions">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Tìm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isLoggedIn && records.length > 0 && (
              <button
                className="btn-export"
                onClick={() => exportRecordsToCsv(records)}
                title="Xuất CSV"
              >
                📥 Xuất CSV
              </button>
            )}
          </div>
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

      <div className="view-scroll-content">
        {groupedEntries.map(([date, items]) => (
          <DayGroup
            key={date}
            date={date}
            records={items}
            viewOnly={!isLoggedIn}
            onDelete={isLoggedIn ? handleDeleteClick : undefined}
            onEdit={isLoggedIn ? setEditingRecord : undefined}
            onViewDetail={!isLoggedIn ? setViewDetailRecord : undefined}
          />
        ))}
      </div>

      {viewDetailRecord && (
        <PersonDetailModal
          record={viewDetailRecord}
          onClose={() => setViewDetailRecord(null)}
        />
      )}

      {editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={handleUpdate}
          onClose={() => setEditingRecord(null)}
        />
      )}

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Xóa lượt trực"
        message="Bạn có chắc muốn xóa lượt trực này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        loading={isDeleting}
      />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
