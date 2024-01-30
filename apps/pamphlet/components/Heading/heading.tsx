import { FC } from 'react';

import styles from './heading.module.scss';

interface TextImageProps {
  subTitle: string;
  title: string;
}

export const Heading: FC<TextImageProps> = ({ title, subTitle }) => {
  return (
    <div className={styles.root}>
      <p>{subTitle}</p>
      <h2 className={styles.heading}>{title}</h2>
    </div>
  );
};
