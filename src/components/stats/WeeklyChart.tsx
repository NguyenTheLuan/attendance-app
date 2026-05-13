import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Get daily counts grouped by week for a given month.
 */
export function getWeeklyDailyCounts(
  records: { date: string; name: string }[],
  monthKey: string
) {
  const monthRecords = records.filter((r) => r.date.startsWith(monthKey));
  const dayCounts = new Map<string, number>();
  for (const r of monthRecords) {
    dayCounts.set(r.date, (dayCounts.get(r.date) ?? 0) + 1);
  }

  const year = parseInt(monthKey.split("-")[0]);
  const month = parseInt(monthKey.split("-")[1]) - 1;
  const lastDay = new Date(year, month + 1, 0);

  function getWeekNumber(d: Date) {
    const temp = new Date(d.valueOf());
    const dayNum = (temp.getDay() + 6) % 7;
    temp.setDate(temp.getDate() - dayNum + 3);
    const firstThursday = temp.valueOf();
    temp.setMonth(0, 1);
    if (temp.getDay() !== 4) {
      temp.setMonth(0, 1 + ((4 - temp.getDay() + 7) % 7));
    }
    return Math.ceil((firstThursday - temp.valueOf()) / 604800000) + 1;
  }

  const weekGroups = new Map<
    number,
    { label: string; data: { day: string; count: number }[] }
  >();

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(year, month, d);
    const ymd = `${monthKey}-${String(d).padStart(2, "0")}`;
    const wn = getWeekNumber(dateObj);
    if (!weekGroups.has(wn)) {
      const weekNum = weekGroups.size + 1;
      weekGroups.set(wn, { label: `Tuần ${weekNum}`, data: [] });
    }
    weekGroups.get(wn)!.data.push({
      day: `${parseInt(String(d))}/${parseInt(monthKey.split("-")[1])}`,
      count: dayCounts.get(ymd) ?? 0,
    });
  }

  return Array.from(weekGroups.values());
}

interface WeeklyChartProps {
  weeks: ReturnType<typeof getWeeklyDailyCounts>;
}

export default function WeeklyChart({ weeks }: WeeklyChartProps) {
  return (
    <>
      {weeks.map((week) => (
        <div key={week.label} className="week-chart">
          <h3 className="week-label">{week.label}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={week.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#e94560"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Lượt trực"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </>
  );
}
