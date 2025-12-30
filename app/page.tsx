'use client';
import { useRef } from 'react';
import Header from './components/header';
import WorkExperience from './components/work-experience';
import LinkSection from './components/link-section';

export default function Page() {
  const asideRef = useRef<HTMLElement>(null);

  return (
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
      <div className='w-full'>
        <LinkSection
          title='Recent'
          items={[
            {
              imageSrc: '/control-room.jpg',
              imageAlt: 'Control room',
              title: 'Deep agents',
              description: 'Agentic design',
            },
            {
              imageSrc: '/dotted-lights.jpg',
              imageAlt: 'Dotted lights',
              title: 'Article title',
              description: 'Article description',
            },
            {
              imageSrc: '/dotted-lights.jpg',
              imageAlt: 'Dotted lights',
              title: 'Article title',
              description: 'Article description',
            },
            {
              imageSrc: '/dotted-lights.jpg',
              imageAlt: 'Dotted lights',
              title: 'Article title',
              description: 'Article description',
            },
          ]}
        />
        <div className='pt-52'>
          <LinkSection
            title='Writing'
            items={[
              {
                imageSrc: '/dotted-lights.jpg',
                imageAlt: 'Dotted lights',
                title: 'Article title',
                description: 'Article description',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
