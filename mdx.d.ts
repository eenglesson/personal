declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const metadata: {
    slug: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    category: 'work' | 'writing';
    date: string;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
