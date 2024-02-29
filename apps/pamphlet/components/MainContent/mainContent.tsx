'use client';
import { useSetNavigationAtom } from '@/utils/atoms/use-navigation';
import {
  CategoriesWithFeatures,
  Section as SectionType,
  Component,
  ItemsOnPamphlet,
} from '@jamphlet/database';
import { useInView } from 'framer-motion';
import React, { FC, useEffect, useRef } from 'react';
import { Comparison, ComparisonProps } from '../Comparison/comparison';
import { Items, ItemsProps } from '../Items/items';
import { Section } from '../Section/section';
import { SectionImage, SectionImageProps } from '../SectionImage/image';
import { StickyText, StickyTextProps } from '../SectionStickyText/stickyText';
import { TextImage, TextImageProps } from '../SectionTextImage/textImage';
import { Text, TextProps } from '../SectionText/text';

type MainContentProps = {
  projectStructure: any;
  pamphletData: ItemsOnPamphlet;
  categories: CategoriesWithFeatures;
};

export const MainContent: FC<MainContentProps> = ({
  projectStructure,
  pamphletData,
  categories,
}) => {
  const setIsNavVisible = useSetNavigationAtom();

  const mainContentRef = useRef(null);
  const isInView = useInView(mainContentRef, { margin: '-80px' });

  useEffect(() => {
    if (isInView) {
      setIsNavVisible(true);
    } else {
      setIsNavVisible(false);
    }
  }, [isInView]);

  type ComponentProp =
    | ComparisonProps
    | ItemsProps
    | TextImageProps
    | TextProps
    | SectionImageProps
    | StickyTextProps;

  const Components = {
    comparisonComponent: Comparison,
    itemsComponent: Items,
    textImageComponent: TextImage,
    textComponent: Text,
    imageComponent: SectionImage,
    stickyTextComponent: StickyText,
  };

  const renderComponents = (component: Component, i: number) => {
    if (!component) return null;
    if (typeof Components[component.type] !== 'undefined') {
      return (
        <div key={i}>
          {React.createElement(Components[component.type] as React.FC<ComponentProp>, {
            projectData: categories,
            itemData: pamphletData,
            ...component,
          })}
        </div>
      );
    }

    return React.createElement(() => <div>Can not find {component.type} component</div>);
  };

  // TODO sort by order
  const renderSections = projectStructure.sections.map((section: SectionType, i: number) => {
    if (section.components.length === 0) {
      return null;
    }
    return (
      <Section key={i} section={section}>
        {section.components.map((component: Component, i: number) => {
          return renderComponents(component, i);
        })}
      </Section>
    );
  });

  return (
    <main id='main' ref={mainContentRef}>
      {renderSections}
    </main>
  );
};
