import { FC } from 'react';
import Image from 'next/image';
import styles from './stickyText.module.scss';
import { Container } from '../Container/container';

interface StickyTextProps {
  text: string;
  images: any[];
}

export const StickyText: FC<StickyTextProps> = ({ text, images }) => {
  if (!text || !images) return null;

  return (
    <Container>
      <div className={styles.grid}>
        <div className={styles.stickyOuter}>
          <div className={styles.stickyInner}>
            <p>{text}</p>
          </div>
        </div>
        <div className={styles.imageOuter}>
          {images.map((image: any, i: number) => (
            <div className={styles.imageInner} key={i}>
              <Image
                src={image.src}
                alt={image.alt}
                // sizes='100vw'
                width={image.width}
                height={image.height}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
