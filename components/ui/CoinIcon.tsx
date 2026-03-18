'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CoinIconProps {
  src: string;
  symbol: string;
  name: string;
  size?: number;
  className?: string;
}

const CoinIcon = ({ src, symbol, name, size = 32, className }: CoinIconProps) => {
  const [error, setError] = useState(false);

  // Generate a consistent background color based on the symbol
  const getBgColor = (text: string) => {
    const hash = text.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 45%)`;
  };

  if (error || !src) {
    return (
      <div 
        className={cn("flex items-center justify-center rounded-full text-white font-bold overflow-hidden shrink-0", className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: getBgColor(symbol),
          fontSize: size * 0.4
        }}
        aria-label={name}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("rounded-full bg-white/5 shrink-0", className)}
      onError={() => setError(true)}
    />
  );
};

export default CoinIcon;
