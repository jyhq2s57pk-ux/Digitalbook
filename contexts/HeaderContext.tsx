'use client';

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

interface HeaderContextType {
  isHeaderVisible: boolean;
  headerHeight: number;
}

const HeaderContext = createContext<HeaderContextType>({
  isHeaderVisible: true,
  headerHeight: 60,
});

export function useHeader() {
  return useContext(HeaderContext);
}

interface HeaderProviderProps {
  children: ReactNode;
}

export function HeaderProvider({ children }: HeaderProviderProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Use refs for scroll tracking to avoid stale closure issues
  const lastScrollY = useRef(0);
  const scrollUpDistance = useRef(0);
  const wasScrollingUp = useRef(false);

  // Header height: 60px on mobile, 58px on desktop (lg)
  const headerHeight = 60;

  useEffect(() => {
    // Set initial scroll position
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollY.current;

      // Determine scroll direction
      const scrollingUp = currentScrollY < previousScrollY;

      // Direction changed - reset distance tracking
      if (scrollingUp !== wasScrollingUp.current) {
        scrollUpDistance.current = 0;
        wasScrollingUp.current = scrollingUp;
      }

      if (scrollingUp) {
        // Accumulate upward scroll distance
        scrollUpDistance.current += (previousScrollY - currentScrollY);

        // Show header after scrolling up 200px OR if near the top of the page
        if (scrollUpDistance.current >= 200 || currentScrollY < 100) {
          setIsHeaderVisible(true);
        }
      } else {
        // Scrolling down - reset distance and hide header
        scrollUpDistance.current = 0;

        // Hide header when scrolling down (but only after passing the header area)
        if (currentScrollY > headerHeight) {
          setIsHeaderVisible(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    // Add scroll listener with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight]);

  return (
    <HeaderContext.Provider value={{ isHeaderVisible, headerHeight }}>
      {children}
    </HeaderContext.Provider>
  );
}
