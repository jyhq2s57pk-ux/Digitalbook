'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

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
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollUpDistance, setScrollUpDistance] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // Header height: 60px on mobile, 58px on desktop (lg)
  const headerHeight = 60;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Determine scroll direction
    const scrollingUp = currentScrollY < lastScrollY;

    if (scrollingUp !== isScrollingUp) {
      // Direction changed, reset scroll distance tracking
      setScrollUpDistance(0);
      setIsScrollingUp(scrollingUp);
    }

    if (scrollingUp) {
      // Accumulate upward scroll distance
      const distance = scrollUpDistance + (lastScrollY - currentScrollY);
      setScrollUpDistance(distance);

      // Show header after scrolling up 200px OR if near the top of the page
      if (distance >= 200 || currentScrollY < 100) {
        setIsHeaderVisible(true);
      }
    } else {
      // Scrolling down
      setScrollUpDistance(0);

      // Hide header when scrolling down (but only after passing the header area)
      if (currentScrollY > headerHeight) {
        setIsHeaderVisible(false);
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, scrollUpDistance, isScrollingUp, headerHeight]);

  useEffect(() => {
    // Set initial scroll position
    setLastScrollY(window.scrollY);

    // Add scroll listener with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <HeaderContext.Provider value={{ isHeaderVisible, headerHeight }}>
      {children}
    </HeaderContext.Provider>
  );
}
