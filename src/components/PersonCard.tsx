import type { AttendanceRecord } from "../types";

interface PersonCardProps {
  record: AttendanceRecord;
  onDelete?: (id: string) => void;
  viewOnly?: boolean;
}

export default function PersonCard({
  record,
  onDelete,
  viewOnly = false,
}: PersonCardProps) {
  return (
    <div className={`person-card ${viewOnly ? "view-card" : ""}`}>
      <img src={record.imageUrl} alt={record.name} loading="lazy" />
      <p>{record.name}</p>
      {!viewOnly && onDelete && (
        <button
          className="btn-delete"
          onClick={() => onDelete(record.id)}
          title="Xóa"
          aria-label={`Xóa ${record.name}`}
        >
          🗑
        </button>
      )}
    </div>
  );
}
