import { load } from 'cheerio';
import type { ContactInfo } from '@signalscout/core';

const unique = (values: string[]): string[] => [...new Set(values)];

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const normalizePhone = (value: string): string => normalizeWhitespace(value);

const digitCount = (value: string): number => (value.match(/\d/g) ?? []).length;

const hasFormattingHints = (value: string): boolean => /[\s\-()/+]/.test(value);

const isLikelyDecimalBlob = (value: string): boolean =>
  /\d+\.\d+/.test(value) || /\d{12,}/.test(value.replace(/[^\d]/g, ''));

const isPlausiblePhone = (value: string): boolean => {
  const normalized = normalizePhone(value);

  if (!normalized) {
    return false;
  }

  if (/[A-Za-z]/.test(normalized)) {
    return false;
  }

  if (isLikelyDecimalBlob(normalized)) {
    return false;
  }

  const digits = digitCount(normalized);

  if (digits < 7 || digits > 15) {
    return false;
  }

  const digitsOnly = normalized.replace(/[^\d]/g, '');

  // Long raw digit strings with no separators are usually garbage in scraped text.
  if (!normalized.startsWith('+') && !hasFormattingHints(normalized) && digitsOnly.length > 11) {
    return false;
  }

  // Very short local-looking numbers without formatting are suspicious too.
  if (!normalized.startsWith('+') && !hasFormattingHints(normalized) && digitsOnly.length < 8) {
    return false;
  }

  // Reject values that are almost entirely one token of digits and unusually long.
  if (/^\d{12,15}$/.test(digitsOnly)) {
    return false;
  }

  return true;
};

export const extractContactInfo = (html: string): ContactInfo => {
  const $ = load(html);
  const bodyText = $('body').text();

  const emailMatches: string[] =
    bodyText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];

  const phoneMatches: string[] =
    bodyText.match(/(\+?\d[\d\s\-()\/]{6,}\d)/g) ?? [];

  const addresses: string[] = [];

  $('[href^="mailto:"]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) return;

    const email = href.replace(/^mailto:/i, '').trim();
    if (email) {
      emailMatches.push(email);
    }
  });

  $('[href^="tel:"]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) return;

    const phone = href.replace(/^tel:/i, '').trim();
    if (phone) {
      phoneMatches.push(phone);
    }
  });

  const cleanedEmails = unique(
    emailMatches.map((value) => value.trim().toLowerCase()),
  );

  const cleanedPhones = unique(
    phoneMatches
      .map(normalizePhone)
      .filter(isPlausiblePhone),
  );

  return {
    emails: cleanedEmails,
    phones: cleanedPhones,
    addresses,
  };
};