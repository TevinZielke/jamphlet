'use client';

import { Footer } from '@/components/Footer/footer';
import { Hero } from '@/components/Hero/hero';
import { Spinner } from '@/components/Spinner/spinner';
import React, { useRef } from 'react';
// import supabase from '@/utils/supabase';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useInView } from 'framer-motion';

import { Comparison } from '@/components/Comparison/comparison';
import { Residences } from '@/components/Residences/residences';
import { TextImage } from '@/components/SectionTextImage/textImage';
import { Text } from '@/components/SectionText/text';
import { SectionImage } from '@/components/SectionImage/image';
import { Navigation } from '@/components/Navigation/navigation';
import { StickyText } from '@/components/SectionStickyText/stickyText';
import { Section } from '@/components/Section/section';
import { pageData } from '@/data';
import { Heading } from '@/components/Heading/heading';
import { MainContent } from '@/components/MainContent/mainContent';

// TODO: Types
type DataProps = {
  id: string;
  name: string;
  text: string;
  Recommendation: RecommendationProps[];
};

type RecommendationProps = {
  id: string;
  comment: string;
  created_at: string;
  residence: ResidenceProps;
};

type ResidenceProps = {
  id: string;
  title: string;
  url: string;
};

export default function Page() {
  const [visibleSection, setVisibleSection] = useState(pageData.sections[0].id);
  const [data, setData] = useState<DataProps | null>(null);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const params = useParams();

  /**
   * Fetch data from Supabase
   */
  const fetchData = async (hash: String | String[]) => {
    // const { data, error } = await supabase
    //   .from('Customers')
    //   .select(
    //     'id, name, text, Recommendation!inner(id, comment, created_at, residence(id, title, url))'
    //   )
    //   .eq('hash', hash);

    // if (data && data.length > 0) {
    //   // @ts-ignore TODO: Fix this
    //   setData(data[0]);
    //   // console.log('data = ', data[0]);
    // } else {
    //   // console.log('data = ', data);
    // }

    // console.log('error = ', error);
    setData({
      id: '1',
      name: 'Visitor',
      text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
      Recommendation: [
        {
          id: '1',
          comment: 'Test',
          created_at: '2021-08-30T12:00:00.000Z',
          residence: {
            id: '1',
            title: 'Test',
            url: 'Test',
          },
        },
      ],
    });
  };

  /**
   * Call fetchData() when the component is mounted
   */
  useEffect(() => {
    if (params.hash) {
      fetchData(params.hash);
    }
  }, [params]);

  /**
   * Set CSS variables
   */
  useEffect(() => {
    // document.documentElement.style.setProperty('--color-text', '#ff0000');
    pageData.styles?.map((style: any) => {
      document.documentElement.style.setProperty(`--${style.label}`, style.value);
    });
  }, []);

  if (!data) {
    return <Spinner />;
  }

  const Components = {
    comparison: Comparison,
    residences: Residences,
    textImage: TextImage,
    text: Text,
    image: SectionImage,
    stickyText: StickyText,
  };

  const renderComponents = (content: any) => {
    // @ts-ignore TODO: Fix this
    if (typeof Components[content.componentName] !== 'undefined') {
      // console.log('content = ', content);
      // @ts-ignore TODO: Fix this
      return React.createElement(Components[content.componentName], {
        ...content,
      });
    }

    return React.createElement(() => <div>Can not find {content.componentName} component</div>);
  };

  const renderSections = pageData.sections.map((section, i: number) => {
    if (section.components.length === 0) {
      return null;
    }

    return (
      <Section
        key={i}
        id={section.id}
        setVisibleSection={setVisibleSection}
        visibleSection={visibleSection}
        background={section.color}
      >
        <Heading title={section.subTitle} subTitle={section.title} />
        {section.components.map((component: any) => {
          return renderComponents(component);
        })}
      </Section>
    );
  });
  {
    /* * TODO: Revise the title and subtitle names as they impact navigation labels as well */
  }

  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
      <Navigation
        sections={pageData.sections}
        activeSection={visibleSection}
        visible={isNavVisible}
      />
      <Hero
        title={data.name}
        text={data.text}
        logo={{ src: '/logo.svg', width: 71, height: 51, alt: 'logo' }}
        background={{ src: '/hero-back.jpg', width: 1600, height: 900, alt: 'background' }}
      />
      <MainContent setIsNavVisible={setIsNavVisible}>{renderSections}</MainContent>

      <Footer />
    </>
  );
}
