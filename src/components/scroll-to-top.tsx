import React, { memo } from 'react';
import { ArrowUpToLine } from 'lucide-react';
import { useScroll, scrollToTop } from '@/hooks/use-scroll';

interface ScrollToTopProps {
  threshold?: number;
}

export const ScrollToTop = memo(function ScrollToTop({ threshold = 300 }: ScrollToTopProps) {
  const isVisible = useScroll(threshold);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
      title="Back to Top"
      aria-label="Scroll to top"
    >
      <ArrowUpToLine className="w-6 h-6 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
});
