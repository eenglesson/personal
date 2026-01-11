import { contentItems, ContentCategory, ContentItem } from '@/app/data/content';
import { LinkItem } from '@/app/components/link-section';
import { createElement } from 'react';

/**
 * Get the N most recent content items across all categories
 */
export function getRecentItems(count: number = 3): ContentItem[] {
  return [...contentItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * Get content items filtered by category
 */
export function getItemsByCategory(category: ContentCategory): ContentItem[] {
  return contentItems
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Convert ContentItem to LinkItem format for LinkSection component
 * Renders the MDX component as content
 */
export function toLinkItem(item: ContentItem): LinkItem {
  return {
    slug: item.slug,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
    title: item.title,
    description: item.description,
    content: createElement(item.Component),
    videoSrc: item.videoSrc,
  };
}

/**
 * Convert array of ContentItems to LinkItems
 */
export function toLinkItems(items: ContentItem[]): LinkItem[] {
  return items.map(toLinkItem);
}
