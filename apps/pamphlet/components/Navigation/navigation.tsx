'use client';
import { FC, useEffect, useState } from 'react';
import styles from './navigation.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import { Section } from '@jamphlet/database';
import { useSectionAtomValue } from '@/utils/atoms/use-section';
import { useNavigationAtomValue } from '@/utils/atoms/use-navigation';

export type NavigationProps = {
  sections: Section[];
  activeSection: string;
  visible: boolean;
};

export const Navigation: FC<NavigationProps> = ({ sections }) => {
  const activeSection = useSectionAtomValue();
  const isVisible = useNavigationAtomValue();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const rootClass = classNames(styles.root, {
    [styles['visible']]: isVisible,
    [styles['show-mobile-menu']]: showMobileMenu,
  });

  const handleMenuClick = () => {
    setShowMobileMenu((showMobileMenu) => !showMobileMenu);
  };

  return (
    <>
      <button name='menu' className={styles['burger']} onClick={() => handleMenuClick()}>
        <span>{showMobileMenu ? 'close' : 'open'} menu</span>
        <div className={styles['burger-icon']}>
          <span></span>
          <span></span>
        </div>
      </button>
      <nav className={rootClass}>
        <ul className={styles.list}>
          {sections.map((section, i: number) => {
            const itemClass = classNames(styles.item, {
              [styles['active']]: activeSection === section.name,
            });

            return (
              <li className={itemClass} key={i}>
                <Link
                  href={`#${section.name}`}
                  className={styles.link}
                  onClick={() => handleMenuClick()}
                >
                  {section.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
