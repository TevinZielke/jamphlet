import React, { FC } from 'react';

import styles from './spinner.module.scss';

export const Spinner: FC = () => {
  return <div className={styles.root}>Loading...</div>;
};
