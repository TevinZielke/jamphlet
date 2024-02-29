import { FC } from 'react';
import Image from 'next/image';
import { Container } from '../Container/container';
import styles from './textImage.module.scss';
import classNames from 'classnames';

export type TextImageProps = {
  id: number;
  image: {
    publicUrl: string;
    alt: string;
    width: number;
    height: number;
  };
  text: string;
  title?: string;
  textRightImageLeft?: boolean;
};

export const TextImage: FC<TextImageProps> = ({
  image,
  text,
  title,
  textRightImageLeft = false,
  id,
}) => {
  if (!image || !text) return null;

  const gridClass = classNames(styles.grid, {
    [styles.gridReverse]: textRightImageLeft,
  });

  return (
    <Container width='extended' key={id}>
      <div className={gridClass}>
        <div>
          {title && <h3>{title}</h3>}
          <p>{text}</p>
        </div>
        <Image src={image.publicUrl} alt={image.alt} width={666} height={333} />
      </div>
    </Container>
  );
};
