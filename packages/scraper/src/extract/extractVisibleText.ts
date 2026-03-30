import { load } from 'cheerio';

const MAX_VISIBLE_TEXT_LENGTH = 12000;

export const extractVisibleText = (html: string): string => {
  const $ = load(html);

  $('script, style, noscript, iframe, svg').remove();

  const text = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= MAX_VISIBLE_TEXT_LENGTH) {
    return text;
  }

  return text.slice(0, MAX_VISIBLE_TEXT_LENGTH);
};