import type { MDXComponents } from 'mdx/types';
import { ComponentPropsWithoutRef } from 'react';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockCode,
} from '@/components/ui/code-block';

function extractLanguage(className?: string): string {
  if (!className) return 'plaintext';
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : 'plaintext';
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className='text-xl md:text-3xl font-normal mb-6 text-balance'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-2xl font-normal mt-8 mb-4 text-balance'>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='text-xl font-normal mt-6 mb-4 text-balance'>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className='text-base md:text-[17.6px] font-normal md:mt-14 mt-12 mb-4 text-balance'>
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className='text-base md:text-[17.6px] text-pretty leading-relaxed mb-4 text-gray-500'>
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className='text-base md:text-[17.6px] list-disc list-inside mb-4 space-y-2 text-gray-500'>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='text-base md:text-[17.6px] list-decimal list-inside mb-4 space-y-2 text-gray-500'>
        {children}
      </ol>
    ),
    li: ({ children }) => <li className='leading-relaxed'>{children}</li>,
    a: ({ children, href }) => (
      <a
        href={href}
        className='text-gray-400 underline underline-offset-4 hover:text-gray-300'
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className='text-base md:text-[17.6px] border-l-2 border-muted-foreground/30 pl-4 italic my-4 text-gray-500'>
        {children}
      </blockquote>
    ),
    pre: ({ children }: ComponentPropsWithoutRef<'pre'>) => {
      return <>{children}</>;
    },
    code: ({
      children,
      className,
      ...props
    }: ComponentPropsWithoutRef<'code'>) => {
      const isInline = !className?.includes('language-');

      if (isInline) {
        return (
          <code
            className='rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800'
            {...props}
          >
            {children}
          </code>
        );
      }

      const language = extractLanguage(className);
      const code = String(children).trim();

      return (
        <CodeBlock>
          <CodeBlockHeader language={language} code={code} />
          <CodeBlockCode code={code} language={language} />
        </CodeBlock>
      );
    },
    hr: () => <hr className='border-muted-foreground/30 my-16' />,
    small: ({ children }) => (
      <small className='text-sm text-gray-500'>{children}</small>
    ),
    Small: ({ children }) => (
      <span className='text-sm text-gray-500'>{children}</span>
    ),
    ...components,
  };
}
