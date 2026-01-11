import { ComponentType } from 'react';

export type ContentCategory = 'work' | 'writing';

export interface ContentMetadata {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  category: ContentCategory;
  date: string;
  videoSrc?: string;
}

export interface ContentItem extends ContentMetadata {
  Component: ComponentType;
}

// Import all MDX files and their metadata
import ProjectAlpha, {
  metadata as projectAlphaMeta,
} from '@/content/work/project-alpha.mdx';
import DeepAgentsLangchain, {
  metadata as deepAgentsLangchainMeta,
} from '@/content/writing/deep-agents-langchain.mdx';

// Register all content items
export const contentItems: ContentItem[] = [
  { ...(projectAlphaMeta as ContentMetadata), Component: ProjectAlpha },
  {
    ...(deepAgentsLangchainMeta as ContentMetadata),
    Component: DeepAgentsLangchain,
  },
];
