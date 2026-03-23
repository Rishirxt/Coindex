import React from 'react';

interface SparklineProps {
  data: number[];
  positive: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, positive, className }) => {
  if (!data || data.length === 0) return <svg className={className} width="80" height="32" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Scale data points to SVG coordinates (width: 80, height: 32)
  // X from 0 to 80, Y from 32 down to 0
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 80;
    const y = 32 - ((val - min) / range) * 32;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = positive ? 'var(--color-primary)' : 'var(--color-negative)';

  return (
    <svg width="80" height="32" viewBox="0 0 80 32" className={className} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
