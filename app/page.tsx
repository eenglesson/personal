'use client';
import { useRef, Suspense } from 'react';
import Header from './components/header';
import WorkExperience from './components/work-experience';
import LinkSection from './components/link-section';
import { PanelProvider } from './components/panel-context';
import { getRecentItems, getItemsByCategory, toLinkItems } from './lib/content';
import Footer from './components/footer';

function ContentSections() {
  const recentItems = toLinkItems(getRecentItems(3));
  const workItems = toLinkItems(getItemsByCategory('work'));
  const writingItems = toLinkItems(getItemsByCategory('writing'));

  return (
    <div className='w-full'>
      <LinkSection
        title='Recent'
        cardWidth='240px'
        cardHeight='340px'
        items={recentItems}
      />
      <div className='pt-40'>
        <LinkSection title='Selected Work' items={workItems} />
      </div>
      <div className='pt-40'>
        <LinkSection title='Writing' items={writingItems} />
      </div>
    </div>
  );
}

export default function Page() {
  const asideRef = useRef<HTMLElement>(null);

  return (
    <PanelProvider>
      <section className='w-full'>
        <aside
          ref={asideRef}
          className='min-h-screen max-w-screen-sm md:max-w-2xl mx-auto px-8 flex items-center'
        >
          <div>
            <Header />
            <WorkExperience containerRef={asideRef} />
          </div>
        </aside>
        <Suspense fallback={null}>
          <ContentSections />
        </Suspense>
      </section>
      <div className='max-w-screen-sm md:max-w-2xl mx-auto px-8 flex items-center pb-32'>
        <Footer />
      </div>
    </PanelProvider>
  );
}
