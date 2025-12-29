import { TextEffect } from '@/components/motion-primitives/text-effect';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='mb-8 flex items-center text-xl'>
      <div className='w-full'>
        <aside className='flex justify-between items-center'>
          <Link href='/' className='font-normal lg:text-2xl text-blue-600'>
            Elias Englesson
          </Link>
          <span className='h-4 w-4 rounded-full dark:bg-white bg-black'></span>
        </aside>
        <TextEffect
          as='p'
          preset='fade'
          per='char'
          className='text-xl lg:text-2xl'
          delay={0.5}
        >
          AI Developer
        </TextEffect>
      </div>
    </header>
  );
}

<span className='h-4 w-4 rounded-full bg-white'></span>;
