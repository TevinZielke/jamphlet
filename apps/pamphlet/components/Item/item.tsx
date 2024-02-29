'use client';

import { useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import styles from './item.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import { Container } from '../Container/container';
import { Heading } from '../Heading/heading';
import { Button } from '../Button/button';
import classNames from 'classnames';
import { Category, FeaturesOnItems, ItemImage } from '@jamphlet/database';

export type ItemProps = {
  setVisibleItem: (itemId: number | null) => void;
  visibleItem: any;
  projectData: any;
  itemData?: any;
};

export const Item: FC<ItemProps> = ({ setVisibleItem, visibleItem, projectData, itemData }) => {
  const itemCategories = projectData;
  const itemImages = itemData.item.itemImages;
  const floorplans = itemImages.filter((image: any) => image.path.includes('floorplan'));
  const galleryImages = itemImages.filter((image: any) => !image.path.includes('floorplan'));

  const { scrollY } = useScroll();
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { margin: '-50%' });

  useEffect(() => {
    if (isInView && visibleItem !== itemData.item.id) {
      setVisibleItem(itemData.item.id);
    } else {
      setVisibleItem(null);
    }
  }, [isInView]);

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
    <div key={itemData.item.id} id={itemData.item.id} className={styles.root} ref={itemRef}>
      <Heading subTitle={'Items'} title={itemData.item.name} />
      <div className={styles.stickyWrapper}>
        <div className={gridClass}>
          <div>
            <div className={styles.main}>
              <div className={styles.mainHeader}>
                <div>
                  <span>{itemData.item.name}</span>
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
                    floorplans.map((image: any, i: number) => (
                      <SwiperSlide className={styles.slide} key={i}>
                        <Image
                          key={image.id}
                          src={image.publicUrl}
                          // fill
                          width={666}
                          height={333}
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
              {itemCategories.map((category: Category) => {
                return (
                  <div key={category.id} className={styles['row-wrapper']}>
                    <div className={styles['row']}>
                      <div className={styles['row-title']}>{category.name}</div>
                      <div className={styles['row-value']}>
                        {itemData.item.featuresOnItems.map((feature: FeaturesOnItems) => {
                          if (feature.categoryId !== category.id) return null;
                          return (
                            <div key={feature.featureId} className={styles['row-item']}>
                              <p className={styles['row-item-label']}>{'feautre label'}</p>
                              <p className={styles['row-item-value']}>{feature.displayText}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
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
            {galleryImages?.length > 0 &&
              galleryImages.map((image: ItemImage) => (
                <SwiperSlide className={styles.slide} key={image.id}>
                  <Image src={image.publicUrl} width={666} height={333} alt={image.alt} />
                </SwiperSlide>
              ))}
          </Swiper>
        </Container>
      </div>
    </div>
  );
};
