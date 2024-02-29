import { FC } from 'react';
import { Container } from '../Container/container';
import styles from './text.module.scss';
import classNames from 'classnames';

export type TextProps = {
  id: number;
  text: string;
  title?: string;
};

export const Text: FC<TextProps> = ({ id, text, title }) => {
  if (!text) return null;

  const gridClass = classNames(styles.grid, {
    // [styles.gridReverse]: textRightImageLeft,
  });

  return (
    <Container width='extended' key={id}>
      <div className={gridClass}>
        <div>
          {title && <h3>{title}</h3>}
          <p>{text}</p>
        </div>
      </div>
    </Container>
  );
};
