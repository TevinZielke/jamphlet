'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { FC, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import styles from './residence.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import { Container } from '../Container/container';
import { Heading } from '../Heading/heading';
import { Button } from '../Button/button';
import classNames from 'classnames';

type ImageProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type ResidenceProps = {
  id: string;
  title: string;
  images: ImageProps[];
  floorplans: ImageProps[];
  rows: any[]; // Specs for each row
  visibleResidence: any;
  setVisibleResidence: any;
};

export const Residence: FC<ResidenceProps> = ({
  id,
  title,
  images,
  floorplans,
  rows,
  setVisibleResidence,
  visibleResidence,
}) => {
  const { scrollY } = useScroll();
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const { ref } = useInView({
    threshold: 0,
    rootMargin: '-50%',
    onChange: (inView, entry) => {
      if (inView && visibleResidence !== entry.target.id) {
        // console.log('entry.target.id = ', entry.target.id);
        setVisibleResidence(entry.target.id);
      } else {
        setVisibleResidence(null);
      }
      console.log('test');
    },
  });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setSideBarCollapsed(false);
  });

  const handleSidebar = () => {
    setSideBarCollapsed((sideBarCollapsed) => !sideBarCollapsed);
  };

  const gridClass = classNames(styles.grid, {
    [styles['grid--collapsed']]: sideBarCollapsed,
  });

  return (
    <div key={id} id={id} className={styles.root} ref={ref}>
      <Heading subTitle={'Residence'} title={title} />
      <div className={styles.stickyWrapper}>
        {/* <div className={styles.stickyHeader}>{title}</div> */}
        <div className={gridClass}>
          <div>
            <div className={styles.main}>
              <div className={styles.mainHeader}>
                <div>
                  <span>{title}</span>
                  <Button variant='filled'>Floorplan (1/2)</Button>
                  <Button variant='filled'>Buildingkey (1/2)</Button>
                </div>
                <Button variant={'filled'} onClick={() => handleSidebar()}>
                  Features
                </Button>
              </div>
              <div className={styles.mainContent}>
                <Swiper
                  modules={[Navigation, A11y]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  className={styles.swiper}
                  // scrollbar={{ draggable: true }}
                  // onSwiper={(swiper) => console.log(swiper)}
                  // onSlideChange={() => console.log('slide change')}
                >
                  {floorplans &&
                    floorplans.map((image, i: number) => (
                      <SwiperSlide className={styles.slide} key={i}>
                        <Image
                          key={image.src}
                          src={image.src}
                          // fill
                          width={image.width}
                          height={image.height}
                          alt={image.alt}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          </div>
          <aside className={styles.aside}>
            <div className={styles.asideHeader}></div>
            <div className={styles.asideContent}>
              {
                /** Residences */
                rows?.length > 0 &&
                  rows.map((row: any) => (
                    <div key={row.id} className={styles['row-wrapper']}>
                      {Object.keys(row).map((key: any, i: number) => (
                        <div key={i} className={styles['row']}>
                          <div className={styles['row-title']}>{key}</div>
                          <div className={styles['row-value']}>
                            {
                              /** Rows */
                              row[key].map((item: any, i: number) => (
                                <div key={i} className={styles['row-item']}>
                                  <p className={styles['row-item-label']}>{item.label}</p>
                                  <p className={styles['row-item-value']}>{item.value}</p>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
              }
            </div>
          </aside>
        </div>
        <Container>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            // onSwiper={(swiper) => console.log(swiper)}
            // onSlideChange={() => console.log('slide change')}
          >
            {images?.length > 0 &&
              images.map((image, i) => (
                <SwiperSlide className={styles.slide} key={i}>
                  <Image
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </Container>
      </div>
    </div>
  );
};
