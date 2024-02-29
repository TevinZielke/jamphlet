'use client';

import React, { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './section.module.scss';
import { useSectionAtom, useSetSectionAtom } from '@/utils/atoms/use-section';
import { useInView } from 'framer-motion';
import { Heading } from '../Heading/heading';
import { Section as SectionType } from '@jamphlet/database';

export type SectionProps = {
  children: React.ReactNode;
  section: SectionType;
  spaceTop?: 's' | 'm' | 'l' | 'xl' | 'none';
  spaceBottom?: 's' | 'm' | 'l' | 'xl' | 'none';
  background?: string;
};

export const Section: FC<SectionProps> = ({
  spaceTop = 'xl',
  spaceBottom = 'xl',
  children,
  section,
  background,
}) => {
  if (!section) return null;

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

  // const { ref } = useInView({
  //   threshold: 0,
  //   rootMargin: '-50%',
  //   onChange: (inView, entry) => {
  //     if (inView && setVisibleSection && visibleSection !== entry.target.id) {
  //       // console.log('entry.target.id = ', entry.target.id);
  //       setVisibleSection(entry.target.id);
  //     }
  //   },
  // });

  const [activeSection, setActiveSection] = useSectionAtom();

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-50%' });

  useEffect(() => {
    if (isInView) {
      setActiveSection(section.name);
    }
  }, [isInView]);

  return (
    <div
      ref={sectionRef}
      className={sectionClass}
      style={{ backgroundColor: background ? background : '' }}
    >
      <Heading title={section.name} subTitle={section.subtitle} />

      {children}
    </div>
  );
};
