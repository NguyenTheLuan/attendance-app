export function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function getTomorrowStr() {
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
