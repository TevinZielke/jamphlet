'use client';
import Image from 'next/image';
import { FC, useState } from 'react';
import styles from './comparison.module.scss';
import { AccordionItem, AccordionRoot } from '../Accordion/accordion';
import { Category, ItemSelection } from '@jamphlet/database';

export type ComparisonProps = {
  id: number;
  projectData: any;
  itemData?: ItemSelection;
};

export const Comparison: FC<ComparisonProps> = ({ projectData, itemData, id }) => {
  const itemCategories = projectData;
  const items = itemData?.itemsOnPamphlets;
  if (!itemCategories || !items) return <p>No project data</p>;

  const [selection, setSelection] = useState<any>([items?.at(2), items?.at(2)]);

  const updateSelection = (position: number, itemId: string) => {
    // get item by id
    const item = items.find((item: any) => item.id === itemId);
    // update the selection with the item at the specified position
    const updatedSelection = [...selection];
    updatedSelection[position] = item;
    setSelection(updatedSelection);
  };

  return (
    <div className={styles.root} key={id}>
      {/** Comparison */}
      <div className={styles['horizontal-wrapper']}>
        {/**
         * Sticky Header
         * */}
        <div className={styles.headerBar}>
          {selection?.length > 0 &&
            selection.map((selectionItem: any, i: number) => (
              <div key={i}>
                <select
                  className={styles.select}
                  value={selection[i]?.item.name}
                  onChange={(e) => updateSelection(i, e.target.value)}
                >
                  {items.map((item: any, i: number) => {
                    // disable the selected items
                    const disabled = selection.some(
                      (disabledItem: any) => item.id === disabledItem.id
                    );
                    return (
                      <option
                        key={i}
                        value={item.item.name}
                        disabled={disabled}
                        aria-disabled={disabled}
                      >
                        {item.item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}
        </div>

        {/**
         * Images
         * */}
        <div className={`${styles.row} ${styles.floorplans}`}>
          {selection?.length > 0 &&
            selection.map((selectionItem: any, i: number) => {
              const itemImages = selectionItem.item.itemImages;
              const floorplans = itemImages.filter((image: any) =>
                image.path.includes('floorplan')
              );
              return (
                <div key={i} className={styles.col}>
                  {floorplans && (
                    <Image
                      src={floorplans.at(0).publicUrl}
                      alt={floorplans.at(0).alt}
                      width={666}
                      height={333}
                    />
                  )}
                </div>
              );
            })}
        </div>

        {/**
         * jump to item
         * */}
        <div className={styles.row}>
          {selection?.length > 0 &&
            // TODO: add ButtonLink component
            selection.map((selectionItem: any, i: number) => (
              <div key={i} className={styles.col}>
                <a href={`#${selectionItem.id}`}>Jump to item</a>
              </div>
            ))}
        </div>

        {/**
         * rows
         * */}
        <div>
          <div key={0} className={styles['row-outer']}>
            <AccordionRoot type='single' collapsible width={'100vw'}>
              {/* Render each category (mainFacts, Pricing, Rooms, etc.) */}
              <AccordionItem title={'Main Facts'} value={'mainFacts'} key={-1}>
                <div key={-1} className={styles['row-inner']}>
                  {selection.map((selectionItem: any, i: number) => {
                    const features = selectionItem.item.featuresOnItems;
                    const mainFacts = features.filter((feature: any) => feature.isMainFact);
                    return (
                      <div key={i}>
                        <ul>
                          {mainFacts.map((mainFact: any, i: number) => {
                            return (
                              <li key={i}>
                                {/* Label: {data.label}, Value:  */}
                                {mainFact.displayText}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </AccordionItem>
              {itemCategories.map((category: Category) => {
                return (
                  <AccordionItem title={category.name!} value={category.name!} key={category.id}>
                    <div className={styles['row-inner']}>
                      {selection.map((selectionItem: any, i: number) => {
                        const features = selectionItem.item.featuresOnItems;
                        const mainFacts = features.filter(
                          (feature: any) => feature.categoryId === category.id
                        );
                        return (
                          <div key={i}>
                            <ul>
                              {mainFacts.map((mainFact: any, i: number) => {
                                return (
                                  <li key={i}>
                                    {/* Label: {data.label}, Value:  */}
                                    {mainFact.displayText}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionItem>
                );
              })}
            </AccordionRoot>
          </div>
        </div>
      </div>
    </div>
  );
};
