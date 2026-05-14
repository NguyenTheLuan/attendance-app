import PersonImage from "~/components/PersonImage";
import type { AttendanceRecord } from "~/types";
import "./styles.css";

interface PersonCardProps {
  record: AttendanceRecord;
  onDelete?: (id: string) => void;
  onEdit?: (record: AttendanceRecord) => void;
  viewOnly?: boolean;
}

export default function PersonCard({
  record,
  onDelete,
  onEdit,
  viewOnly = false,
}: PersonCardProps) {
  return (
    <div className={`person-card ${viewOnly ? "view-card" : ""}`}>
      <PersonImage
        src={record.imageUrl}
        alt={record.name}
        square={!viewOnly}
        className={viewOnly ? "" : "person-card-image"}
        onClick={onEdit ? () => onEdit(record) : undefined}
      />
      <div className="person-info">
        <strong className="person-name">{record.name}</strong>
        {record.note && <p className="person-note">{record.note}</p>}
      </div>
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
