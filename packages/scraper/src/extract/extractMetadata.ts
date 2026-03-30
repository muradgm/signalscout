import { load } from 'cheerio';

export interface ExtractedMetadata {
  pageTitle: string | null;
  metaDescription: string | null;
}

const cleanText = (value: string | undefined | null): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();

  return normalized.length > 0 ? normalized : null;
};

export const extractMetadata = (html: string): ExtractedMetadata => {
  const $ = load(html);

  const pageTitle = cleanText($('title').first().text());
  const metaDescription = cleanText(
    $('meta[name="description"]').attr('content') ?? null,
  );

  return {
    pageTitle,
    metaDescription,
  };
};