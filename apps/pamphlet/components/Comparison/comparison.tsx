// import { ResidenceProps } from '@/app/[hash]/page';
import Image from 'next/image';
import { FC, useState } from 'react';
import styles from './comparison.module.scss';
import { AccordionItem, AccordionRoot } from '../Accordion/accordion';

interface ComparisonProps {
  data?: any;
}

export const Comparison: FC<ComparisonProps> = ({ data }) => {
  const residences = data;
  const [selection, setSelection] = useState<any>([residences[0], residences[1]]);

  // Initialize an empty object to store aggregated data
  const aggregatedData: any = {};

  // Loop through each residence
  selection &&
    selection.forEach((residence: any) => {
      // Loop through each row in the residence
      residence.rows.forEach((row: any) => {
        // Loop through each key (mainFacts, Pricing, Rooms, etc.) in the row
        Object.keys(row).forEach((key) => {
          // If the key doesn't exist in the aggregatedData object, create it as an empty array
          if (!aggregatedData[key]) {
            aggregatedData[key] = [];
          }

          // Find the corresponding entry for the current residence ID
          const entry = aggregatedData[key].find((item: any) => item[residence.id]);

          // If the entry doesn't exist, create it and push the data
          if (!entry) {
            const newEntry = {
              [residence.id]: row[key],
            };
            aggregatedData[key].push(newEntry);
          } else {
            // If the entry exists, push the data to the existing residence's array
            entry[residence.id].push(...row[key]);
          }
        });
      });
    });

  // convert the aggregatedData object to the specified structure
  const newArray = Object.keys(aggregatedData).map((key) => {
    return {
      [key]: aggregatedData[key],
    };
  });

  const updateSelection = (position: number, residenceId: string) => {
    // get residence by id
    const residence = residences.find((item: any) => item.id === residenceId);

    // update the selection with the residence at the specified position
    const updatedSelection = [...selection];
    updatedSelection[position] = residence;
    setSelection(updatedSelection);
  };

  // console.log('selection = ', selection);

  return (
    <div className={styles.root}>
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
                  value={selection[i]?.id}
                  onChange={(e) => updateSelection(i, e.target.value)}
                >
                  {residences.map((residence: any, i: number) => {
                    // disable the selected residences
                    const disabled = selection.some((item: any) => item.id === residence.id);
                    return (
                      <option
                        value={residence.id}
                        // selected={selection[i]?.id}
                        disabled={disabled}
                        aria-disabled={disabled}
                      >
                        {residence.title}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}
        </div>

        {/**
         * floorplans
         * */}
        <div className={`${styles.row} ${styles.floorplans}`}>
          {selection?.length > 0 &&
            selection.map((selectionItem: any, i: number) => (
              <div key={i} className={styles.col}>
                {selectionItem.floorplans && (
                  <Image
                    src={selectionItem.floorplans[0]?.src}
                    alt={selectionItem.floorplans[0]?.alt}
                    width={selectionItem.floorplans[0]?.width}
                    height={selectionItem.floorplans[0]?.height}
                  />
                )}
              </div>
            ))}
        </div>

        {/**
         * jump to residence
         * */}
        <div className={styles.row}>
          {selection?.length > 0 &&
            // TODO: add ButtonLink component
            selection.map((selectionItem: any, i: number) => (
              <div key={i} className={styles.col}>
                <a href={`#${selectionItem.id}`}>jump to residence</a>
              </div>
            ))}
        </div>

        {/**
         * rows
         * */}
        <div>
          {/* Render the transformed data rows */}
          {newArray.map((item: any, i: number) => (
            <div key={i} className={styles['row-outer']}>
              <AccordionRoot type='single' collapsible width={'100vw'}>
                {/* Render each category (mainFacts, Pricing, Rooms, etc.) */}
                {Object.keys(item).map((category) => (
                  <AccordionItem title={category} value={category}>
                    <div key={category} className={styles['row-inner']}>
                      {/* Render data for each residence within the category */}
                      {item[category].map((residenceData: any, i: number) => (
                        <div key={i}>
                          <ul>
                            {/* Render label-value pairs for each residence */}
                            {
                              // @ts-ignore
                              residenceData[Object.keys(residenceData)].map(
                                (data: any, i: number) => (
                                  <li key={i}>
                                    {/* Label: {data.label}, Value:  */}
                                    {data.value}
                                  </li>
                                )
                              )
                            }
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </AccordionRoot>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
