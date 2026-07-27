import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

registerLocale("vi", vi);

interface DateSelectorProps {
  dateType: "today" | "tomorrow" | "custom";
  customDate: string;
  onDateTypeChange: (type: "today" | "tomorrow" | "custom") => void;
  onCustomDateChange: (date: string) => void;
  disabled?: boolean;
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
        <div className="custom-datepicker-wrapper">
          <DatePicker
            selected={customDate ? new Date(customDate) : null}
            onChange={(date: Date | null) => {
              if (date) {
                // Ensure local timezone doesn't mess up the date string
                const offset = date.getTimezoneOffset();
                const adjustedDate = new Date(date.getTime() - (offset*60*1000));
                onCustomDateChange(adjustedDate.toISOString().split("T")[0]);
              }
            }}
            dateFormat="dd/MM/yyyy"
            locale="vi"
            disabled={disabled}
            placeholderText="Chọn ngày..."
            popperPlacement="bottom-start"
          />
        </div>
      )}
    </label>
  );
}
