'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { TextMorph } from './text-morph';

type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
};

function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <div
      className={cn(
        'not-prose flex w-full flex-col overflow-clip rounded-xl border',
        'border-none bg-zinc-50 dark:border-none dark:bg-zinc-900',
        className
      )}
    >
      {children}
    </div>
  );
}

type CodeBlockHeaderProps = {
  language: string;
  code: string;
};

function CodeBlockHeader({ language, code }: CodeBlockHeaderProps) {
  return (
    <div className="flex h-10 items-center justify-between border-b border-none px-4 dark:border-none">
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {language}
      </span>
      <CopyButton code={code} />
    </div>
  );
}

type CopyButtonProps = {
  code: string;
};

function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={onCopy}
      type="button"
      className="inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
    >
      <TextMorph as="span">{copied ? 'Copied' : 'Copy'}</TextMorph>
    </button>
  );
}

type CodeBlockCodeProps = {
  code: string;
  language?: string;
};

function CodeBlockCode({ code, language = 'plaintext' }: CodeBlockCodeProps) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    async function highlight() {
      const highlighted = await codeToHtml(code, {
        lang: language,
        theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
      });
      setHtml(highlighted);
    }
    highlight();
  }, [code, language, resolvedTheme]);

  if (!html) {
    return (
      <div className="overflow-x-auto p-4">
        <pre className="text-sm">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-x-auto text-sm scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        '[&>pre]:!bg-transparent [&>pre]:p-4'
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { CodeBlock, CodeBlockHeader, CodeBlockCode, CopyButton };
