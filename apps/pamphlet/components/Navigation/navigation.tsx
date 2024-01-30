import { FC, useEffect, useState } from 'react';
import styles from './navigation.module.scss';
import Link from 'next/link';
import classNames from 'classnames';

interface NavigationProps {
  sections: any;
  activeSection: string;
  visible: boolean;
}

export const Navigation: FC<NavigationProps> = ({ sections, activeSection, visible }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const rootClass = classNames(styles.root, {
    [styles['visible']]: visible,
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
          {sections.map((item: any) => {
            const itemClass = classNames(styles.item, {
              [styles['active']]: activeSection === item.id,
            });

            return (
              <li className={itemClass} key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className={styles.link}
                  onClick={() => handleMenuClick()}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
