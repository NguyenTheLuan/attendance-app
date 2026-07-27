import type { AttendanceRecord } from "~/types";
import "./styles.css";

// Extract initials for fallback avatar
function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface PersonCardProps {
  record: AttendanceRecord;
  onDelete?: (id: string) => void;
  onEdit?: (record: AttendanceRecord) => void;
  onViewDetail?: (record: AttendanceRecord) => void;
  viewOnly?: boolean;
}

export default function PersonCard({
  record,
  onDelete,
  onEdit,
  onViewDetail,
  viewOnly = false,
}: PersonCardProps) {
  const handleImageClick = () => {
    if (onEdit) {
      onEdit(record);
    } else if (onViewDetail) {
      onViewDetail(record);
    }
  };

  const hasImage = !!record.imageUrl;
  
  // Calculate a consistent color based on name length for fallback avatar
  const colorIndex = (record.name.length % 8) + 1;

  return (
    <div className="person-row">
      <div 
        className="person-avatar"
        style={{ 
          backgroundColor: hasImage ? "transparent" : `var(--chart-${colorIndex})`,
          backgroundImage: hasImage ? `url(${record.imageUrl})` : "none",
          cursor: (onEdit || onViewDetail) ? "pointer" : "default"
        }}
        onClick={(onEdit || onViewDetail) ? handleImageClick : undefined}
        title={(onEdit || onViewDetail) ? "Nhấn để xem chi tiết" : ""}
      >
        {!hasImage && getInitials(record.name)}
      </div>
      
      <div className="person-row-info">
        <div className="person-row-name">{record.name}</div>
        {record.note && <div className="person-row-note">{record.note}</div>}
      </div>
      
      {!viewOnly && (
        <div className="person-row-actions">
          {onEdit && (
            <button
              type="button"
              className="btn-icon"
              onClick={() => onEdit(record)}
              title="Sửa"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn-icon delete-icon"
              onClick={() => onDelete(record.id)}
              title="Xóa"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
