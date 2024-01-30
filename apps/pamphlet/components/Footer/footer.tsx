import React, { FC } from 'react';

import styles from './footer.module.scss';
import { Container } from '../Container/container';
import { Section } from '../Section/section';

export const Footer: FC = () => {
  return (
    <div className={styles.root}>
      <Section setVisibleSection={undefined} background='var(--color-foreground)'>
        <Container>
          <h2>get in touch</h2>
        </Container>
      </Section>
    </div>
  );
};
