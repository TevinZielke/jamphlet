import { Provider as JotaiProvider } from 'jotai';
import { Footer } from '@/components/Footer/footer';
import { Hero } from '@/components/Hero/hero';
import { Spinner } from '@/components/Spinner/spinner';
import React, { useRef } from 'react';
import Head from 'next/head';
import { Navigation } from '@/components/Navigation/navigation';
import { MainContent } from '@/components/MainContent/mainContent';

import {
  ProjectStructureConfig,
  Section as SectionType,
  getClientAction,
  getProjectAction,
  getProjectFormSchemaAction,
} from '@jamphlet/database';

// TODO: types

export default async function ClientPage({ params }: { params: { hash: number } }) {
  const clientId: number = +params.hash;
  const clientData = await getClientAction(clientId);

  if (!clientData) {
    return <Spinner />;
  }

  const pamphletData = clientData.pamphlets.at(0);

  const projStructureData = await getProjectAction(1);
  if (!projStructureData) return <p>No proj</p>;
  const json = projStructureData.projectStructure?.json as string;
  const projectStructure: ProjectStructureConfig = JSON.parse(json);

  const projectSchemaData = await getProjectFormSchemaAction(1);
  if (!projectSchemaData?.categories) return <p>No cateogry data</p>;
  const projectCategories = projectSchemaData.categories;

  /**
   * Set CSS variables
   */
  // useEffect(() => {
  //   // document.documentElement.style.setProperty('--color-text', '#ff0000');
  //   pageData.styles?.map((style: any) => {
  //     document.documentElement.style.setProperty(`--${style.label}`, style.value);
  //   });
  // }, []);

  // if (!data) {
  //   return <Spinner />;
  // }
  {
    /* * TODO: Revise the title and subtitle names as they impact navigation labels as well */
  }

  return (
    <>
      <JotaiProvider>
        <Head>
          <title>My page title</title>
        </Head>
        <Navigation sections={projectStructure.sections} activeSection={'0'} visible={false} />
        <Hero
          title={clientData.name}
          text={pamphletData?.personalMessage}
          logo={{ src: '/logo.svg', width: 71, height: 51, alt: 'logo' }}
          background={{ src: '/hero-back.jpg', width: 1600, height: 900, alt: 'background' }}
        />
        <MainContent
          projectStructure={projectStructure}
          categories={projectCategories}
          pamphletData={pamphletData}
        />

        <Footer />
      </JotaiProvider>
    </>
  );
}
