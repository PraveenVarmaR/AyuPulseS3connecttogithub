interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 200,
  height = 48,
  stroke = '#22d3ee',
  fill = 'rgba(34,211,238,0.12)',
  strokeWidth = 1.5,
}: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${path} L${width},${height} L0,${height} Z`;
  const gid = `spark-${stroke.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block w-full">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface EcgWaveformProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

export function EcgWaveform({
  data,
  width = 600,
  height = 100,
  stroke = '#34d399',
}: EcgWaveformProps) {
  if (data.length < 2) return null;
  const stepX = width / (data.length - 1);
  const mid = height / 2;
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = mid - v * (mid - 8);
    return [x, y] as const;
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full"
      preserveAspectRatio="none"
    >
      <line x1="0" y1={mid} x2={width} y2={mid} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
