'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';
import ContentPanel from './content-panel';

export interface LinkItem {
  slug: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  content?: ReactNode;
  videoSrc?: string;
}

interface LinkSectionProps {
  title: string;
  items: LinkItem[];
  cardWidth?: string;
  cardHeight?: string;
}

export default function LinkSection({
  title,
  items,
  cardWidth,
  cardHeight,
}: LinkSectionProps) {
  return (
    <section>
      <h2 className='text-xl lg:text-[22px] max-w-screen-sm md:max-w-2xl mx-auto px-8 text-balance'>
        {title}
      </h2>
      <div className='overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        <div className='flex gap-6 w-max pl-[max(2rem,calc((100%-640px)/2+2rem))] md:pl-[max(2rem,calc((100%-672px)/2+2rem))] pr-8 py-14'>
          {items.map((item, index) => (
            <ContentPanel
              key={item.slug}
              slug={item.slug}
              title={item.title}
              trigger={
                <motion.div
                  style={{
                    width: cardWidth ?? '320px',
                    height: cardHeight ?? '420px',
                  }}
                  className='relative shrink-0 rounded-2xl overflow-hidden cursor-pointer'
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '-25px 25px 50px -12px rgba(0, 0, 0, 0.35)',
                  }}
                  transition={{
                    scale: {
                      type: 'spring',
                      stiffness: 180,
                      damping: 10,
                    },
                    boxShadow: {
                      duration: 0.2,
                    },
                  }}
                >
                  {item.videoSrc ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className='absolute inset-0 w-full h-full object-cover'
                    >
                      <source src={item.videoSrc} type='video/mp4' />
                    </video>
                  ) : (
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className='object-cover'
                    />
                  )}
                  <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6 flex justify-between'>
                    <aside className='flex flex-col text-body'>
                      <h3 className='text-primary-foreground text-balance'>{item.title}</h3>
                      <p className='text-accent-foreground dark:text-secondary-foreground text-pretty'>
                        {item.description}
                      </p>
                    </aside>
                    <ArrowRight
                      className='-rotate-45 size-5.5 text-primary-foreground'
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.div>
              }
            >
              {item.content}
            </ContentPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
