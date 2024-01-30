import { FC } from 'react';
import Image from 'next/image';
import { Container } from '../Container/container';
import styles from './textImage.module.scss';
import classNames from 'classnames';

interface TextImageProps {
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  text: string;
  title?: string;
  textRightImageLeft?: boolean;
}

export const TextImage: FC<TextImageProps> = ({
  image,
  text,
  title,
  textRightImageLeft = false,
}) => {
  if (!image || !text) return null;

  const gridClass = classNames(styles.grid, {
    [styles.gridReverse]: textRightImageLeft,
  });

  return (
    <Container width='extended'>
      <div className={gridClass}>
        <div>
          {title && <h3>{title}</h3>}
          <p>{text}</p>
        </div>
        <Image src={image.url} alt={image.alt} width={image.width} height={image.height} />
      </div>
    </Container>
  );
};
