"use client";

interface TrendSeries {
  name: string;
  color: string;
  data: number[];
}

interface TrendLineChartProps {
  labels: string[];
  series: TrendSeries[];
  threshold?: number;
  thresholdLabel?: string;
  yDomain: [number, number];
  height?: number;
  compact?: boolean;
}

export function TrendLineChart({ labels, series, threshold, thresholdLabel, yDomain, height = 200, compact = false }: TrendLineChartProps) {
  const width = 600;
  const pl = compact ? 30 : 40;
  const pr = 20;
  const pt = 20;
  const pb = compact ? 25 : 35;
  const cw = width - pl - pr;
  const ch = height - pt - pb;
  const [yMin, yMax] = yDomain;
  const yRange = yMax - yMin;

  const xPos = (i: number) => pl + (i / (labels.length - 1)) * cw;
  const yPos = (v: number) => pt + ch - ((v - yMin) / yRange) * ch;

  const makePath = (data: number[]) => data.map((v, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yPos(v)}`).join(" ");
  const makeArea = (data: number[]) => makePath(data) + ` L ${xPos(data.length - 1)} ${pt + ch} L ${pl} ${pt + ch} Z`;

  const gridValues = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        {/* Grid */}
        {gridValues.map((v) => (
          <g key={v}>
            <line x1={pl} y1={yPos(v)} x2={width - pr} y2={yPos(v)} stroke="#F3F4F6" strokeWidth={1} />
            <text x={pl - 5} y={yPos(v)} textAnchor="end" dominantBaseline="middle" fontSize={9} fill="#9CA3AF">{v.toFixed(1)}</text>
          </g>
        ))}
        {/* Threshold */}
        {threshold !== undefined && (
          <>
            <line x1={pl} y1={yPos(threshold)} x2={width - pr} y2={yPos(threshold)} stroke="#C4704A" strokeWidth={1} strokeDasharray="4 2" />
            {!compact && thresholdLabel && <text x={width - pr - 2} y={yPos(threshold) - 6} textAnchor="end" fontSize={8} fill="#C4704A">{thresholdLabel}</text>}
          </>
        )}
        {/* Series */}
        {series.map((s) => (
          <g key={s.name}>
            <path d={makeArea(s.data)} fill={s.color} fillOpacity={0.08} />
            <path d={makePath(s.data)} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, i) => <circle key={i} cx={xPos(i)} cy={yPos(v)} r={3} fill={s.color} stroke="white" strokeWidth={1.5} />)}
          </g>
        ))}
        {/* X labels */}
        {labels.map((l, i) => <text key={l} x={xPos(i)} y={height - 5} textAnchor="middle" fontSize={9} fill="#9CA3AF">{l}</text>)}
      </svg>
    </div>
  );
}
