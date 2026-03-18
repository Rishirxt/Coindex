'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-8 right-8 p-3 bg-purple-600 text-white rounded-full shadow-2xl transition-all duration-300 z-50 hover:bg-purple-500 hover:scale-110 active:scale-95",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default BackToTop;
