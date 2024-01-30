// 'use client';

import React, { FC, useRef } from 'react';
import classNames from 'classnames';

import { InView, useInView } from 'react-intersection-observer';
import styles from './section.module.scss';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  spaceTop?: 's' | 'm' | 'l' | 'xl' | 'none';
  spaceBottom?: 's' | 'm' | 'l' | 'xl' | 'none';
  setVisibleSection?: any;
  background?: string;
  visibleSection?: string;
}

export const Section: FC<SectionProps> = ({
  spaceTop = 'xl',
  spaceBottom = 'xl',
  id = '',
  children,
  setVisibleSection,
  visibleSection,
  background,
}) => {
  const sectionClass = classNames(styles.section, {
    // space top
    [styles['section--top-s']]: spaceTop === 's',
    [styles['section--top-m']]: spaceTop === 'm',
    [styles['section--top-l']]: spaceTop === 'l',
    [styles['section--top-l']]: spaceTop === 'l',
    [styles['section--top-xl']]: spaceTop === 'xl',
    // space bottom
    [styles['section--bottom-s']]: spaceBottom === 's',
    [styles['section--bottom-m']]: spaceBottom === 'm',
    [styles['section--bottom-xl']]: spaceBottom === 'xl',
  });

  // TODO:
  // https://dev.to/maciekgrzybek/create-section-navigation-with-react-and-intersection-observer-fg0
  // https://dev.to/thomasledoux1/highlighting-navigation-items-on-scroll-in-react-with-intersectionobserver-29hb

  const { ref } = useInView({
    threshold: 0,
    rootMargin: '-50%',
    onChange: (inView, entry) => {
      if (inView && setVisibleSection && visibleSection !== entry.target.id) {
        // console.log('entry.target.id = ', entry.target.id);
        setVisibleSection(entry.target.id);
      }
    },
  });

  return (
    <div
      ref={ref}
      className={sectionClass}
      id={id}
      style={{ backgroundColor: background ? background : '' }}
    >
      {children}
    </div>
  );
};
