'use client';
import { useRef } from 'react';
import Header from './components/header';
import WorkExperience from './components/work-experience';

export default function Page() {
  const asideRef = useRef<HTMLElement>(null);

  return (
    <section className='w-full'>
      <aside
        ref={asideRef}
        className='min-h-screen max-w-screen-sm md:w-screen-lg mx-auto px-8 flex items-center'
      >
        <div>
          <Header />
          <WorkExperience containerRef={asideRef} />
        </div>
      </aside>
      <div className='bg-accent-foreground h-[1000px]'></div>
    </section>
  );
}
