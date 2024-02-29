import { FC } from 'react';
import Image from 'next/image';
import { Container } from '../Container/container';
import styles from './image.module.scss';
import { ProjectImage } from '@jamphlet/database';

export type SectionImageProps = {
  image: any;
};

export const SectionImage: FC<SectionImageProps> = ({ image }) => {
  if (!image) return null;

  return (
    <Container width='extended'>
      <div className={styles.grid}>
        hallo
        <Image src={image.publicUrl!} alt={image.alt!} width={666} height={333} />
      </div>
    </Container>
  );
};
