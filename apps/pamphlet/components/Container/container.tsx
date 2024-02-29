import React, { FC } from 'react';
import styles from './container.module.scss';
import classNames from 'classnames';

interface ContainerProps {
  children: React.ReactNode;
  width?: 'full-bleed' | 'extended';
}

export const Container: FC<ContainerProps> = ({ children, width }) => {
  const rootClass = classNames(styles.container, {
    [styles['full-bleed']]: width === 'full-bleed',
    [styles.extended]: width === 'extended',
  });

  return <div className={rootClass}>{children}</div>;
};
