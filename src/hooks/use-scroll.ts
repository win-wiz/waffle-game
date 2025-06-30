import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll position
 * @param threshold - The scroll position threshold to trigger the sticky state
 * @returns boolean indicating if the page has scrolled past the threshold
 */
export const useScroll = (threshold: number = 50): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > threshold);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};

/**
 * Utility function to smoothly scroll to an element
 * @param elementId - The ID of the target element
 * @param offset - Optional offset from the top (default: 80px for fixed header)
 */
export const scrollToElement = (elementId: string, offset: number = 80): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Utility function to smoothly scroll to the top of the page
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
