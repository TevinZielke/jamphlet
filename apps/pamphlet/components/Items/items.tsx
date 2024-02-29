'use client';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './items.module.scss';
import Link from 'next/link';
import { Item } from '../Item/item';
import { Container } from '../Container/container';
import { useInView } from 'framer-motion';
import classNames from 'classnames';
import { ItemSelection, ItemsOnPamphlet } from '@jamphlet/database';

export type ItemsProps = {
  id: number;
  projectData: any;
  itemData?: ItemSelection;
};

export const Items: FC<ItemsProps> = ({ projectData, itemData, id }) => {
  const [visibleItem, setVisibleItem] = useState<number | null>(null);
  const [isItemsNavVisible, setIsItemsNavVisible] = useState<boolean>(false);
  const itemsRef = useRef(null);
  const isInView = useInView(itemsRef, { margin: '-50%' });

  useEffect(() => {
    // console.log(isInView);
    if (isInView) {
      setIsItemsNavVisible(true);
    } else {
      setIsItemsNavVisible(false);
    }
  }, [isInView]);

  const items = itemData?.itemsOnPamphlets;
  if (!items) return null;

  const sideNavClass = classNames(styles.sideNav, {
    [styles['visible']]: isItemsNavVisible,
  });

  return (
    <>
      {/**
       * Items Overview / Anchor Links
       * */}
      <Container width='extended' key={id}>
        {items?.length > 0 && (
          <ul className={styles.overview}>
            {items.map((item: any, i: number) => (
              <li key={i}>
                <Link href={`#${item.itemId}`}>
                  <span>{`0${i + 1}`}</span>
                  <div>
                    <h3>{item.item.name}</h3>
                    {item.comment && <p className={styles.comment}>{item.comment}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
      <Container width='full-bleed'>
        {/**
         * Items Navigation
         * */}
        <aside className={sideNavClass}>
          <ul>
            {items?.length > 0 &&
              items.map((item: any, i: number) => {
                return (
                  <li key={i}>
                    <Link
                      href={`#${item.itemId}`}
                      className={item.itemId === visibleItem ? styles.active : ''}
                    >
                      <span>{`0${i + 1}`}</span>
                      <span className={styles.title}>{item.item.name}</span>
                      <div className={styles.background} />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </aside>

        {/**
         * Items
         * */}
        <div ref={itemsRef}>
          {items?.length > 0 &&
            items.map((item: any, i: number) => (
              <Item
                key={item.itemId}
                visibleItem={visibleItem}
                setVisibleItem={setVisibleItem}
                itemData={items.find((foundItem) => foundItem.itemId === item.itemId)}
                projectData={projectData}
              />
            ))}
        </div>
      </Container>
    </>
  );
};
