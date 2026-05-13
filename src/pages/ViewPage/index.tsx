import { useState } from "react";
import { useRecords } from "~/hooks/useRecords";
import DayGroup from "~/components/DayGroup";
import EditModal from "~/components/EditModal";
import { exportRecordsToCsv } from "~/utils/exportCsv";
import { deleteRecordById, updateRecordById } from "~/services/db";
import type { AttendanceRecord } from "~/types";

interface ViewPageProps {
  isLoggedIn: boolean;
}

export default function ViewPage({ isLoggedIn }: ViewPageProps) {
  const [search, setSearch] = useState("");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null
  );
  const { records, loading, error, load } = useRecords();

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

  async function handleDelete(id: string) {
    if (window.confirm("Bạn có chắc muốn xóa lượt trực này?")) {
      await deleteRecordById(id);
      await load();
    }
  }

  async function handleUpdate(data: {
    name: string;
    date: string;
    imageUrl: string;
    note?: string;
  }) {
    if (!editingRecord) return;
    await updateRecordById(editingRecord.id, data);
    await load();
    setEditingRecord(null);
  }

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
          <DayGroup
            key={date}
            date={date}
            records={items}
            viewOnly={!isLoggedIn}
            onDelete={isLoggedIn ? handleDelete : undefined}
            onEdit={isLoggedIn ? setEditingRecord : undefined}
          />
        ))}

      {editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setEditingRecord(null)}
        />
      )}
    </div>
  );
}
