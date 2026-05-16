import PersonCard from "~/components/PersonCard";
import type { AttendanceRecord } from "~/types";
import "./styles.css";

interface CardGroupProps {
  title: string;
  records: AttendanceRecord[];
  onViewDetail?: (record: AttendanceRecord) => void;
  hideImages?: boolean;
}

/**
 * A compact card group for displaying a list of person cards under a title.
 * Used in stats pages where only view details is needed (no delete/edit).
 */
export default function CardGroup({
  title,
  records,
  onViewDetail,
  hideImages = false,
}: CardGroupProps) {
  return (
    <div className="card-group">
      <div className="card-group-title">{title}</div>
      <div className="person-grid">
        {records.map((record) => (
          <PersonCard
            key={record.id}
            record={record}
            viewOnly
            onViewDetail={onViewDetail}
            hideImages={hideImages}
          />
        ))}
      </div>
    </div>
  );
}
