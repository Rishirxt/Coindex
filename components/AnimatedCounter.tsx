'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    formatValue?: (val: number) => string;
}

// cubic ease out
const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
};

export default function AnimatedCounter({
    value,
    duration = 800,
    formatValue = (v) => Math.floor(v).toLocaleString()
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            const easedPercentage = easeOutCubic(percentage);
            const currentCount = value * easedPercentage;

            setCount(currentCount);

            if (percentage < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [value, duration]);

    return <span>{formatValue(count)}</span>;
}
