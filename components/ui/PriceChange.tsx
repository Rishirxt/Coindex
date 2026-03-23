import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceChangeProps {
  value: number;
  className?: string;
  hideArrow?: boolean;
}

export const PriceChange: React.FC<PriceChangeProps> = ({ value, className, hideArrow = false }) => {
  if (value === null || value === undefined) return <span className={cn("text-white/50", className)}>-</span>;
  
  const isPositive = value >= 0;
  const absValue = Math.abs(value).toFixed(2);

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium",
        isPositive ? "text-positive" : "text-negative",
        className
      )}
    >
      {!hideArrow && (
        isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 mr-1" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 mr-1" />
        )
      )}
      {absValue}%
    </div>
  );
};
