'use client';

// import { ResidenceProps } from '@/app/[hash]/page';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './residences.module.scss';
import Link from 'next/link';
import { Residence } from '../Residence/residence';
import { Container } from '../Container/container';
// import { useInView } from 'react-intersection-observer';
import { useInView } from 'framer-motion';
import classNames from 'classnames';

interface ResidencesProps {
  data: any;
}

export const Residences: FC<ResidencesProps> = ({ data }) => {
  const [visibleResidence, setVisibleResidence] = useState<string | null>(null);
  const [isResidencesNavVisible, setIsResidencesNavVisible] = useState<boolean>(false);
  // const { ref: residencesRef } = useInView({
  //   threshold: 0,
  //   rootMargin: '-50%',
  //   initialInView: true,
  //   onChange: (inView) => {
  //     if (inView) {
  //       setIsResidencesNavVisible(true);
  //     } else {
  //       setIsResidencesNavVisible(false);
  //     }
  //   },
  // });
  const residencesRef = useRef(null);
  const isInView = useInView(residencesRef, { margin: '-50%' });

  useEffect(() => {
    // console.log(isInView);
    if (isInView) {
      setIsResidencesNavVisible(true);
    } else {
      setIsResidencesNavVisible(false);
    }
  }, [isInView]);

  const residences = data;

  const sideNavClass = classNames(styles.sideNav, {
    [styles['visible']]: isResidencesNavVisible,
  });

  return (
    <>
      {/**
       * Residences Overview / Anchor Links
       * */}
      <Container width='extended'>
        {residences?.length > 0 && (
          <ul className={styles.overview}>
            {residences.map((residence: any, i: number) => (
              <li key={i}>
                <Link href={`#${residence.id}`}>
                  <span>{`0${i + 1}`}</span>
                  <div>
                    <h3>{residence.title}</h3>
                    {residence.comment && <p className={styles.comment}>{residence.comment}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
      <Container width='full-bleed'>
        {/**
         * Residences Navigation
         * */}
        <aside className={sideNavClass}>
          <ul>
            {residences?.length > 0 &&
              residences.map((residence: any, i: number) => (
                <li key={i}>
                  <Link
                    href={`#${residence.id}`}
                    className={residence.id === visibleResidence ? styles.active : ''}
                  >
                    <span>{`0${i + 1}`}</span>
                    <span className={styles.title}>{residence.title}</span>
                    <div className={styles.background} />
                  </Link>
                </li>
              ))}
          </ul>
        </aside>

        {/**
         * Residences
         * */}
        <div ref={residencesRef}>
          {residences?.length > 0 &&
            residences.map((residence: any, i: number) => (
              <Residence
                key={i}
                id={residence.id}
                title={residence.title}
                floorplans={residence.floorplans}
                images={residence.images}
                rows={residence.rows}
                visibleResidence={visibleResidence}
                setVisibleResidence={setVisibleResidence}
              />
            ))}
        </div>
      </Container>
    </>
  );
};
