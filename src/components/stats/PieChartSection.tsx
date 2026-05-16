import { useMemo } from "react";
import { useIsMobile } from "~/hooks/useIsMobile";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Rectangle,
} from "recharts";

interface BarDataItem {
  name: string;
  value: number;
}

interface PieChartSectionProps {
  data: BarDataItem[];
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

export default function PieChartSection({ data }: PieChartSectionProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = Math.max(...sorted.map((d) => d.value), 1);
  const isMobile = useIsMobile();

  const chartMargin = useMemo(
    () =>
      isMobile
        ? { top: 6, right: 8, left: 4, bottom: 4 }
        : { top: 8, right: 40, left: 80, bottom: 8 },
    [isMobile]
  );

  const yAxisWidth = isMobile ? 90 : 70;
  const yAxisFontSize = isMobile ? 11 : 13;
  const barSize = isMobile ? 18 : 24;
  const barLabelFontSize = isMobile ? 10 : 12;
  const xAxisFontSize = isMobile ? 10 : 12;

  return (
    <div className="card">
      <h2>📊 Phân bố theo người</h2>
      <ResponsiveContainer
        width="100%"
        height={Math.max(
          isMobile ? 200 : 350,
          sorted.length * (isMobile ? 38 : 48)
        )}
      >
        <BarChart data={sorted} layout="vertical" margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, top + Math.ceil(top * 0.15)]}
            tick={{ fontSize: xAxisFontSize, fill: "var(--text-muted)" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={yAxisWidth}
            tick={{ fontSize: yAxisFontSize, fill: "var(--text-primary)" }}
          />
          <Tooltip
            formatter={(value) => [`${value ?? 0} lần`, "Tổng số"]}
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: isMobile ? 12 : 14,
            }}
          />
          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
            maxBarSize={barSize}
            label={{
              position: "right",
              fill: "var(--text-muted)",
              fontSize: barLabelFontSize,
              formatter: (v) => `${v ?? 0} lần`,
            }}
            shape={(props: {
              index: number;
              x: number;
              y: number;
              width: number;
              height: number;
            }) => {
              return (
                <Rectangle
                  {...props}
                  fill={COLORS[props.index % COLORS.length]}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
