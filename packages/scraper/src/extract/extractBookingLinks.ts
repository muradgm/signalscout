import { load } from 'cheerio';

const BOOKING_KEYWORDS = [
  'book',
  'booking',
  'appoint',
  'appointment',
  'termin',
  'online-termin',
  'terminbuchung',
  'buchen',
  'reserv',
  'reserve',
  'schedule',
  'jetzt buchen',
  'termin vereinbaren',
  'book now',
];

const EXCLUDED_HOST_PATTERNS = [
  /facebook\.com/i,
  /instagram\.com/i,
  /linkedin\.com/i,
  /youtube\.com/i,
  /x\.com/i,
  /twitter\.com/i,
  /tiktok\.com/i,
];

const toAbsoluteUrl = (href: string, baseUrl: string): string | null => {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
};

const isExcludedHost = (url: string): boolean => {
  return EXCLUDED_HOST_PATTERNS.some((pattern) => pattern.test(url));
};

const normalizeText = (value: string): string => value.toLowerCase().replace(/\s+/g, ' ').trim();

export const extractBookingLinks = (html: string, baseUrl: string): string[] => {
  const $ = load(html);
  const links = new Set<string>();

  $('a[href], button, [role="button"]').each((_, element) => {
    const href = $(element).attr('href') ?? '';
    const text = normalizeText($(element).text());
    const ariaLabel = normalizeText($(element).attr('aria-label') ?? '');
    const title = normalizeText($(element).attr('title') ?? '');

    const combinedText = `${text} ${ariaLabel} ${title}`.trim();
    const normalizedHref = href.toLowerCase();

    const textLooksLikeBooking = BOOKING_KEYWORDS.some((keyword) =>
      combinedText.includes(keyword),
    );

    const hrefLooksLikeBooking = BOOKING_KEYWORDS.some((keyword) =>
      normalizedHref.includes(keyword),
    );

    if (!textLooksLikeBooking && !hrefLooksLikeBooking) {
      return;
    }

    if (!href) {
      return;
    }

    const absoluteUrl = toAbsoluteUrl(href, baseUrl);

    if (!absoluteUrl) {
      return;
    }

    if (isExcludedHost(absoluteUrl)) {
      return;
    }

    links.add(absoluteUrl);
  });

  return [...links];
};