'use client';

import React, { FC } from 'react';
import { useInView } from 'react-intersection-observer';

interface MainContentProps {
  children: React.ReactNode;
  setIsNavVisible: any;
}

export const MainContent: FC<MainContentProps> = ({ children, setIsNavVisible }) => {
  const { ref } = useInView({
    threshold: 0,
    rootMargin: '-80px',
    onChange: (inView) => {
      if (inView) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
    },
  });

  return (
    <main id='main' ref={ref}>
      {children}
    </main>
  );
};
