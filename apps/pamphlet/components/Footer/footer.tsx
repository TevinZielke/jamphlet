import React, { FC } from 'react';

import styles from './footer.module.scss';
import { Container } from '../Container/container';
import { Section } from '../Section/section';
import { Section as SectionType } from '@jamphlet/database';

const section: SectionType = {
  name: 'Footer',
  subtitle: 'Footer Subtitle',
  order: 66,
  components: [
    {
      type: 'textComponent',
      text: 'Footer text',
      order: 0,
    },
  ],
};

export const Footer: FC = () => {
  return (
    <div className={styles.root}>
      {/* <Section setVisibleSection={undefined} background='var(--color-foreground)'> */}
      <Section background='var(--color-foreground)' section={section}>
        <Container>
          <h2>get in touch</h2>
        </Container>
      </Section>
    </div>
  );
};
