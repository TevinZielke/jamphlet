import { FC } from 'react';
import Image from 'next/image';
import { Container } from '../Container/container';
import styles from './image.module.scss';
import { ProjectImage } from '@jamphlet/database';

export type SectionImageProps = {
  id: number;
  // image: {
  //   src: string;
  //   alt: string;
  //   width: number;
  //   height: number;
  // };
  image: any;
};
// type SectionImageProps = {
//   image: any;
// };

export const SectionImage: FC<SectionImageProps> = ({ id, image }) => {
  console.log('image', image);
  if (!image) return null;

  return (
    <Container width='extended' key={id}>
      <div className={styles.grid}>
        hallo
        <Image src={image.publicUrl!} alt={image.alt!} width={666} height={333} />
      </div>
    </Container>
  );
};
