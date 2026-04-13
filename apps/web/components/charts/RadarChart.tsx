"use client";

interface RadarDataPoint {
  domain: string;
  score: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  priorData?: RadarDataPoint[];
  maxValue: number;
  threshold: number;
  size?: number;
}

export function RadarChart({ data, priorData, maxValue, threshold, size = 400 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const n = data.length;

  function getPoint(index: number, value: number) {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function getLabelPoint(index: number) {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
    const r = radius + 22;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const makePoly = (points: RadarDataPoint[]) =>
    points.map((d, i) => { const p = getPoint(i, d.score); return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`; }).join(" ") + " Z";

  const thresholdPoly = data.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const r = (threshold / maxValue) * radius;
    return `${i === 0 ? "M" : "L"} ${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)}`;
  }).join(" ") + " Z";

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid circles */}
        {[1, 2, 3, 4, 5].map((level) => (
          <circle key={level} cx={cx} cy={cy} r={(level / maxValue) * radius} fill="none" stroke="#E5E7EB" strokeWidth={1} />
        ))}
        {/* Grid spokes */}
        {data.map((_, i) => { const p = getPoint(i, maxValue); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth={1} />; })}
        {/* Threshold zone */}
        <path d={thresholdPoly} fill="rgba(196,112,74,0.08)" stroke="rgba(196,112,74,0.3)" strokeWidth={1} strokeDasharray="4 2" />
        {/* Prior polygon */}
        {priorData && <path d={makePoly(priorData)} fill="rgba(107,114,128,0.1)" stroke="rgba(107,114,128,0.4)" strokeWidth={1.5} />}
        {/* Current polygon */}
        <path d={makePoly(data)} fill="rgba(45,125,115,0.15)" stroke="#2D7D73" strokeWidth={2} />
        {/* Data points */}
        {data.map((d, i) => { const p = getPoint(i, d.score); return <circle key={i} cx={p.x} cy={p.y} r={4} fill={d.score >= threshold ? "#C4704A" : "#2D7D73"} stroke="white" strokeWidth={1.5} />; })}
        {/* Labels */}
        {data.map((d, i) => {
          const p = getLabelPoint(i);
          const elevated = d.score >= threshold;
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={elevated ? "#C4704A" : "#6B7280"} fontWeight={elevated ? "700" : "400"}>{d.domain.length > 12 ? d.domain.substring(0, 12) + "…" : d.domain}</text>;
        })}
      </svg>
    </div>
  );
}
