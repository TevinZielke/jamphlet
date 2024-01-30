import { FC } from 'react';
import Image from 'next/image';
import { Container } from '../Container/container';
import styles from './image.module.scss';

interface SectionImageProps {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const SectionImage: FC<SectionImageProps> = ({ image }) => {
  if (!image) return null;

  return (
    <Container width='extended'>
      <div className={styles.grid}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
      </div>
    </Container>
  );
};
