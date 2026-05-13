interface DateSelectorProps {
  dateType: "today" | "tomorrow" | "custom";
  customDate: string;
  onDateTypeChange: (type: "today" | "tomorrow" | "custom") => void;
  onCustomDateChange: (date: string) => void;
  disabled?: boolean;
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function getDateString(
  dateType: "today" | "tomorrow" | "custom",
  customDate: string
) {
  if (dateType === "today") return getTodayStr();
  if (dateType === "tomorrow") return getTomorrowStr();
  return customDate;
}

export default function DateSelector({
  dateType,
  customDate,
  onDateTypeChange,
  onCustomDateChange,
  disabled = false,
}: DateSelectorProps) {
  return (
    <label className="field">
      <span>Ngày trực</span>
      <div className="row">
        <button
          type="button"
          className={dateType === "today" ? "active" : ""}
          onClick={() => onDateTypeChange("today")}
          disabled={disabled}
        >
          Hôm nay
        </button>
        <button
          type="button"
          className={dateType === "tomorrow" ? "active" : ""}
          onClick={() => onDateTypeChange("tomorrow")}
          disabled={disabled}
        >
          Mai
        </button>
        <button
          type="button"
          className={dateType === "custom" ? "active" : ""}
          onClick={() => onDateTypeChange("custom")}
          disabled={disabled}
        >
          Ngày khác
        </button>
      </div>
      {dateType === "custom" && (
        <input
          type="date"
          value={customDate}
          onChange={(e) => onCustomDateChange(e.target.value)}
          disabled={disabled}
        />
      )}
    </label>
  );
}
