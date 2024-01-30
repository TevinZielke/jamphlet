import { motion, useScroll, useTransform } from 'framer-motion';
import React, { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './hero.module.scss';
import { Container } from '../Container/container';
import classNames from 'classnames';
import Link from 'next/link';

type HeroProps = {
  text?: string;
  title?: string;
  logo?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  background?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
};

export const Hero: FC<HeroProps> = ({ text, title, logo, background }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const scale = useTransform(scrollYProgress, [0, 1], ['105%', '100%']);

  useEffect(() => {
    setVisible(true);
  }, []);

  const rootClass = classNames(styles.root, {
    [styles.visible]: visible,
  });

  return (
    <div className={rootClass} ref={ref}>
      <Container>
        <div className={styles.content}>
          {logo && (
            <Link href='#' className={styles.logo}>
              <Image
                src={logo.src}
                width={logo.width}
                height={logo.height}
                alt={logo.alt}
                priority
              />
            </Link>
          )}
          <div>
            <h1 className={styles.heading}>Hi {title}</h1>
            <p className={styles.text}>{text}</p>
          </div>
          <Link href='#main' className={styles.button}>
            <div className={styles.scrollDown} />
          </Link>
        </div>
      </Container>

      {/** background */}
      <motion.div
        className={styles.backgroundWrapper}
        style={{
          y: y,
          scale: scale,
        }}
      >
        {!!background && (
          <Image
            fill
            src={background.src}
            alt={background.alt}
            priority
            className={styles.backgroundImage}
          />
        )}
      </motion.div>
    </div>
  );
};
