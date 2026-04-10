import { load } from 'cheerio';
import type { ContactInfo } from '@signalscout/core';

const normalizeWhitespace = (value: string): string =>
  value.replace(/[\u00A0\u2007\u202F]/g, ' ').replace(/\s+/g, ' ').trim();

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const uniqueBy = <T>(values: T[], keyFn: (value: T) => string): T[] => {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = keyFn(value);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const EMAIL_PATTERN =
  /(?<![a-z0-9._%+-])[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}(?![a-z0-9.-])/giu;

const CONTACT_SECTION_SELECTORS = [
  'address',
  'footer',
  '[class*="address"]',
  '[id*="address"]',
  '[class*="kontakt"]',
  '[id*="kontakt"]',
  '[class*="contact"]',
  '[id*="contact"]',
].join(', ');

const normalizeEmail = (value: string): string | null => {
  const decodedValue = decodeURIComponent(value).replace(/^mailto:/i, '');
  const primaryValue = decodedValue.split(/[?#,;]/)[0];
  const normalized = normalizeWhitespace(primaryValue)
    .replace(/www\.[^\s]+$/i, '')
    .toLowerCase();
  const extracted = normalized.match(EMAIL_PATTERN)?.[0] ?? null;

  if (!extracted) {
    return null;
  }

  return extracted;
};

const formatGermanNationalPhone = (digitsOnly: string): string => {
  if (!digitsOnly.startsWith('0') || digitsOnly.length < 8) {
    return digitsOnly;
  }

  const groupSubscriber = (subscriber: string): string => {
    if (subscriber.length === 7) {
      return `${subscriber.slice(0, 3)} ${subscriber.slice(3, 5)} ${subscriber.slice(5)}`;
    }

    if (subscriber.length <= 4) {
      return subscriber.match(/.{1,2}/g)?.join(' ') ?? subscriber;
    }

    const remainder = subscriber.length % 2;
    const prefixLength = remainder === 1 ? subscriber.length - 3 : subscriber.length;
    const prefix = subscriber.slice(0, prefixLength);
    const suffix = subscriber.slice(prefixLength);
    const prefixGroups = prefix.match(/.{1,2}/g) ?? [];

    return [...prefixGroups, suffix].filter(Boolean).join(' ');
  };

  if (digitsOnly.startsWith('030') && digitsOnly.length > 3) {
    const subscriber = digitsOnly.slice(3);
    const grouped = groupSubscriber(subscriber);
    return `030 ${grouped}`.trim();
  }

  if (digitsOnly.length <= 11) {
    const areaCode = digitsOnly.slice(0, 4);
    const subscriber = digitsOnly.slice(4);

    if (subscriber.length > 0) {
      const grouped = groupSubscriber(subscriber);
      return `${areaCode} ${grouped}`.trim();
    }
  }

  const areaCode = digitsOnly.slice(0, 5);
  const subscriber = digitsOnly.slice(5);
  const grouped = groupSubscriber(subscriber);

  return `${areaCode} ${grouped}`.trim();
};

const normalizePhone = (value: string): string => {
  const normalized = normalizeWhitespace(value)
    .replace(/^tel:/i, '')
    .replace(/[;,.:]+$/g, '')
    .replace(/\(\s*0\s*\)/g, '(0)')
    .replace(/[/-]+/g, ' ')
    .replace(/\s*([()])\s*/g, '$1')
    .replace(/(?<=\d)\s+(?=\d)/g, ' ')
    .trim();

  const digitsOnly = normalized.replace(/[^\d]/g, '');

  if (!digitsOnly) {
    return normalized;
  }

  if (normalized.startsWith('+49')) {
    const nationalDigits = `0${digitsOnly.slice(2)}`;
    return formatGermanNationalPhone(nationalDigits);
  }

  if (normalized.startsWith('0049')) {
    const nationalDigits = `0${digitsOnly.slice(4)}`;
    return formatGermanNationalPhone(nationalDigits);
  }

  if (digitsOnly.startsWith('49') && !normalized.startsWith('+') && !normalized.startsWith('00')) {
    return formatGermanNationalPhone(`0${digitsOnly.slice(2)}`);
  }

  if (digitsOnly.startsWith('0')) {
    return formatGermanNationalPhone(digitsOnly);
  }

  return normalized;
};

const normalizeAddress = (value: string): string =>
  normalizeWhitespace(value)
    .replace(/([a-zäöüß])([A-ZÄÖÜ])/gu, '$1 $2')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s*[–-]\s*/g, ' - ')
    .replace(/\s+\)/g, ')')
    .replace(/\(\s+/g, '(')
    .trim();

const digitCount = (value: string): number => (value.match(/\d/g) ?? []).length;

const hasFormattingHints = (value: string): boolean => /[\s\-()/+]/.test(value);

const isLikelyDecimalBlob = (value: string): boolean =>
  /\d+\.\d+/.test(value) ||
  (!hasFormattingHints(value) && /\d{12,}/.test(value.replace(/[^\d]/g, '')));

const isLikelyYearRange = (value: string): boolean =>
  /\b(?:19|20)\d{2}\s*-\s*(?:19|20)\d{2}\b/.test(value);

const isLikelyIdentifierLikeNumber = (value: string): boolean =>
  /^\d{7,}-\d{1,2}$/.test(value.replace(/\s+/g, ''));

const isLikelyPostalFragment = (value: string): boolean =>
  /^\d{5}(?:\s+\d{1,3})?$/.test(value.replace(/[^\d\s]/g, '').trim());

const hasTooManyShortNumericGroups = (value: string): boolean => {
  const groups = value.match(/\d+/g) ?? [];
  const shortGroups = groups.filter((group) => group.length <= 2).length;

  return groups.length >= 3 && shortGroups >= 2 && !groups.some((group) => group.length >= 3);
};

const isLikelyGermanPhonePrefix = (value: string): boolean => {
  const digitsOnly = value.replace(/[^\d]/g, '');

  return (
    digitsOnly.startsWith('0') ||
    digitsOnly.startsWith('49') ||
    value.startsWith('+49') ||
    value.startsWith('0049')
  );
};

const streetSuffixPattern =
  '(?:straße|str(?:a(?:ss|ß)e)?\\.?|str\\.?|weg|allee|platz|ring|gasse|ufer|damm|chaussee|steig|pfad|markt|kai)';

const addressCandidatePatterns = [
  /\bAm\s+[A-Z][\p{L}.'-]+\s+\d{1,4}[A-Za-z]?(?:\s*,)?\s+\d{5}\s+[A-Z][\p{L}.'-]+(?:\s+[A-Z][\p{L}.'-]+){0,3}(?:\s*[–-]\s*[A-Z][\p{L}.'-]+(?:\s+[A-Z][\p{L}.'-]+){0,2})?/giu,
  /\b[A-ZÄÖÜ][\p{L}.']+(?:-[A-ZÄÖÜ][\p{L}.']+)+\s+\d{1,4}[A-Za-z]?(?:\s*[·,])?\s+\d{5}\s+[A-ZÄÖÜ][\p{L}.'-]+(?:\s*[–-]\s*[A-ZÄÖÜ][\p{L}.'-]+(?:\s+[A-ZÄÖÜ][\p{L}.'-]+){0,2})?/giu,
  /\b[A-ZÄÖÜ][\p{L}.']*(?:-[A-ZÄÖÜ][\p{L}.']*)*-(?:Straße|Str\.|Strasse|Weg|Allee|Platz|Ring|Gasse|Ufer|Damm|Chaussee|Steig|Pfad|Markt|Kai)\s+\d{1,4}[A-Za-z]?(?:\s*,)?\s+\d{5}\s+[A-ZÄÖÜ][\p{L}.'-]+(?:\s*[–-]\s*[A-ZÄÖÜ][\p{L}.'-]+(?:\s+[A-ZÄÖÜ][\p{L}.'-]+){0,2})?/giu,
  new RegExp(
    `\\b(?:[A-Z][\\p{L}.'-]*(?:\\s+[A-Z][\\p{L}.'-]*){0,4}\\s+${streetSuffixPattern}|[A-Z][\\p{L}.'-]*${streetSuffixPattern})\\s+\\d{1,4}[A-Za-z]?(?:\\s*[A-Za-z])?(?:\\s*,)?\\s+\\d{5}\\s+[A-Z][\\p{L}.'-]+(?:\\s+[A-Z][\\p{L}.'-]+){0,3}(?:\\s*[–-]\\s*[A-Z][\\p{L}.'-]+(?:\\s+[A-Z][\\p{L}.'-]+){0,2})?`,
    'giu',
  ),
  /\b(?!(?:Kontakt|Adresse|Anschrift|Zahnärztin|Zahnarzt|Praxis|Master|Telefon|Fax|Mail)\b)(?:[A-ZÄÖÜ][\p{L}.'-]+(?:\s+[A-ZÄÖÜ][\p{L}.'-]+){0,3})\s+(?:Straße|Str\.|Strasse|Weg|Allee|Platz|Ring|Gasse|Ufer|Damm|Chaussee|Steig|Pfad|Markt|Kai)\s+\d{1,4}[A-Za-z]?(?:\s*,)?\s+\d{5}\s+[A-ZÄÖÜ][\p{L}.'-]+(?:\s*[–-]\s*[A-ZÄÖÜ][\p{L}.'-]+(?:\s+[A-ZÄÖÜ][\p{L}.'-]+){0,2})?/giu,
];

const streetWordWithSuffixPattern = new RegExp(
  `\\b[A-Z][\\p{L}.'-]*${streetSuffixPattern}\\b`,
  'iu',
);

const streetPhraseWithStandaloneSuffixPattern = new RegExp(
  `\\b(?!(?:Kontakt|Adresse|Anschrift|Zahnärztin|Zahnarzt|Praxis|Master|Telefon|Fax|Mail)\\b)(?:[A-Z][\\p{L}.'-]+\\s+){0,3}${streetSuffixPattern}\\b`,
  'iu',
);

const preciseGermanStreetStartPattern =
  /\b(?:[A-ZÄÖÜ][\p{L}.'-]+\s+){1,2}(?:Straße|Str\.|Strasse|Weg|Allee|Platz|Ring|Gasse|Ufer|Damm|Chaussee|Steig|Pfad|Markt|Kai)\b/iu;

const compoundGermanStreetStartPattern =
  /\b[A-ZÄÖÜ][\p{L}.']*(?:-[A-ZÄÖÜ][\p{L}.']*)*-(?:Straße|Str\.|Strasse|Weg|Allee|Platz|Ring|Gasse|Ufer|Damm|Chaussee|Steig|Pfad|Markt|Kai)\b/iu;

const exactGermanAddressPattern =
  /\b(?!(?:Kontakt|Adresse|Anschrift|ZahnÃ¤rztin|Zahnarzt|Praxis|Master|Telefon|Fax|Mail)\b)(?:[A-ZÃ„Ã–Ãœ][\p{L}.'-]+(?:-[A-ZÃ„Ã–Ãœ][\p{L}.'-]+)*(?:\s+[A-ZÃ„Ã–Ãœ][\p{L}.'-]+(?:-[A-ZÃ„Ã–Ãœ][\p{L}.'-]+)*){0,3})\s+\d{1,4}[A-Za-z]?(?:\s*,)?\s+\d{5}\s+[A-ZÃ„Ã–Ãœ][\p{L}.'-]+(?:\s+[A-ZÃ„Ã–Ãœ][\p{L}.'-]+){0,3}/u;

const exactHyphenatedGermanAddressPattern =
  /\b[A-Z][\p{L}.']+(?:-[A-Z][\p{L}.']+){1,4}\s+\d{1,4}[A-Za-z]?(?:\s*,)?\s+\d{5}\s+[A-Z][\p{L}.'-]+(?:\s+[A-Z][\p{L}.'-]+){0,3}/u;

const trimAddressToStreet = (value: string): string => {
  const cleanup = (candidate: string): string =>
    candidate
      .replace(/^(?:kontakt|adresse|anschrift|e-?mail|mail)\s*:?\s*/i, '')
      .replace(/^(?:e-?mail|mail)(?=[A-Z])/u, '')
      .replace(/\b(?:tel|telefon|fax|e-?mail|mail)\b[\s\S]*$/i, '')
      .replace(/\b(?:mo|di|mi|do|fr|sa|so)\b[\s\S]*$/i, '')
      .replace(/\b(?:geöffnet|geoeffnet|uhr)\b[\s\S]*$/i, '')
      .trim();

  const normalized = cleanup(normalizeAddress(value));
  const exactHyphenatedAddressMatch = normalized.match(exactHyphenatedGermanAddressPattern);

  if (exactHyphenatedAddressMatch?.[0]) {
    return cleanup(exactHyphenatedAddressMatch[0]);
  }

  const exactCompoundAddressMatch = normalized.match(exactGermanAddressPattern);

  if (exactCompoundAddressMatch?.[0]) {
    return cleanup(exactCompoundAddressMatch[0]);
  }

  const compoundStreetStartMatch = normalized.match(compoundGermanStreetStartPattern);

  if (compoundStreetStartMatch?.index !== undefined) {
    return cleanup(normalized.slice(compoundStreetStartMatch.index));
  }

  const preciseStreetStartMatch = normalized.match(preciseGermanStreetStartPattern);

  if (preciseStreetStartMatch?.index !== undefined) {
    return cleanup(normalized.slice(preciseStreetStartMatch.index));
  }

  const streetWordMatch = normalized.match(streetWordWithSuffixPattern);

  if (streetWordMatch?.index !== undefined) {
    return cleanup(normalized.slice(streetWordMatch.index));
  }

  const streetPhraseMatch = normalized.match(streetPhraseWithStandaloneSuffixPattern);

  if (streetPhraseMatch?.index !== undefined) {
    return cleanup(normalized.slice(streetPhraseMatch.index));
  }

  return cleanup(normalized);
};

const isLikelyAddress = (value: string): boolean => {
  const trimmed = trimAddressToStreet(value);

  if (!trimmed) {
    return false;
  }

  if (!/\d{5}/.test(trimmed) || !/\d{1,4}[A-Za-z]?(?:\s*[A-Za-z])?/.test(trimmed)) {
    return false;
  }

  if (/\b(?:mo|di|mi|do|fr|sa|so|uhr|geöffnet|geoeffnet)\b/i.test(trimmed)) {
    return false;
  }

  return (
    /^Am\s+[A-Z][\p{L}.'-]+\s+\d/iu.test(trimmed) ||
    new RegExp(`(?:${streetSuffixPattern})\\s+\\d`, 'i').test(trimmed)
  );
};

const toAddressKey = (value: string): string => {
  const normalized = value.toLowerCase();
  const houseNumber = normalized.match(/\d{1,4}[a-z]?/u)?.[0] ?? '';
  const postalCode = normalized.match(/\b\d{5}\b/u)?.[0] ?? '';
  const city = normalized.match(/\b\d{5}\s+([a-zäöüß.'-]+(?:\s+[a-zäöüß.'-]+)*)/u)?.[1] ?? '';

  return [houseNumber, postalCode, city].filter(Boolean).join('|');
};

const expandAddressFromContext = (address: string, textBlocks: string[]): string => {
  const trimmed = trimAddressToStreet(address);
  const anchor = trimmed.match(/\d{1,4}[A-Za-z]?(?:\s*[·,])?\s+\d{5}\s+[A-ZÄÖÜ][\p{L}.'-]+(?:\s*[–-]\s*[A-ZÄÖÜ][\p{L}.'-]+)?/u)?.[0];

  if (!anchor) {
    return trimmed;
  }

  const [firstWord, ...restWords] = trimmed.split(/\s+/);
  const restAfterFirstWord = restWords.join(' ');

  for (const text of textBlocks) {
    if (restAfterFirstWord && /^(?:straße|str\.?|strasse|weg|allee|platz|ring|gasse|ufer|damm|chaussee|steig|pfad|markt|kai)$/iu.test(firstWord)) {
      const prefixedPattern = new RegExp(
        `([A-ZÄÖÜ][\\p{L}.']+(?:-[A-ZÄÖÜ][\\p{L}.']+)+-${escapeRegExp(firstWord)}\\s+${escapeRegExp(restAfterFirstWord)})`,
        'iu',
      );
      const prefixedMatch = text.match(prefixedPattern)?.[1];

      if (prefixedMatch) {
        return trimAddressToStreet(prefixedMatch);
      }
    }

    const pattern = new RegExp(
      `([A-ZÄÖÜ][\\p{L}.']+(?:-[A-ZÄÖÜ][\\p{L}.']+)*(?:\\s+[A-ZÄÖÜ][\\p{L}.']+(?:-[A-ZÄÖÜ][\\p{L}.']+)*){0,2}\\s+${escapeRegExp(anchor)})`,
      'iu',
    );
    const match = text.match(pattern)?.[1];

    if (match) {
      return trimAddressToStreet(match);
    }
  }

  return trimmed;
};

const toPhoneKey = (value: string): string => {
  const digitsOnly = value.replace(/[^\d]/g, '');

  if (value.startsWith('+')) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.startsWith('49')) {
    return `0${digitsOnly.slice(2)}`;
  }

  if (value.startsWith('00')) {
    return `+${digitsOnly.slice(2)}`;
  }

  return digitsOnly;
};

const isPlausiblePhone = (value: string): boolean => {
  const normalized = normalizePhone(value);

  if (!normalized || /[A-Za-z]/.test(normalized)) {
    return false;
  }

  if (
    isLikelyDecimalBlob(normalized) ||
    isLikelyYearRange(normalized) ||
    isLikelyIdentifierLikeNumber(normalized) ||
    isLikelyPostalFragment(normalized) ||
    hasTooManyShortNumericGroups(normalized)
  ) {
    return false;
  }

  const digitsOnly = normalized.replace(/[^\d]/g, '');
  const digits = digitsOnly.length;

  if (digits < 8 || digits > 15) {
    return false;
  }

  if (!normalized.startsWith('+') && !hasFormattingHints(normalized) && digitsOnly.length > 11) {
    return false;
  }

  if (!isLikelyGermanPhonePrefix(normalized)) {
    return false;
  }

  return true;
};

const collectScopedText = ($: ReturnType<typeof load>): string[] => {
  const values = new Set<string>();

  const pushText = (value: string): void => {
    const normalized = normalizeWhitespace(value);

    if (normalized) {
      values.add(normalized);
    }
  };

  pushText($('body').text());

  $(CONTACT_SECTION_SELECTORS).each((_, element) => {
    pushText($(element).text());
  });

  return [...values];
};

export const extractContactInfo = (html: string): ContactInfo => {
  const $ = load(html);
  const textBlocks = collectScopedText($);
  const emailMatches: string[] = [];
  const phoneMatches: string[] = [];
  const addressMatches = new Set<string>();

  for (const text of textBlocks) {
    for (const match of text.matchAll(EMAIL_PATTERN)) {
      const candidate = match[0];

      if (candidate) {
        emailMatches.push(candidate);
      }
    }

    for (const pattern of addressCandidatePatterns) {
      for (const match of text.matchAll(pattern)) {
        const candidate = match[0];

        if (candidate) {
          addressMatches.add(candidate);
        }
      }
    }
  }

  $('[href^="mailto:"]').each((_, element) => {
    const href = $(element).attr('href');
    const text = $(element).text();

    if (href) {
      emailMatches.push(href);
    }

    if (text) {
      emailMatches.push(text);
    }
  });

  $('[href^="tel:"]').each((_, element) => {
    const href = $(element).attr('href');
    const text = $(element).text();
    const textLooksLikePhone = text && /\d/.test(text);

    if (textLooksLikePhone) {
      phoneMatches.push(text);
    } else if (href) {
      phoneMatches.push(href);
    }
  });

  if (phoneMatches.length === 0) {
    for (const text of textBlocks) {
      const contextMatches =
        text.match(
          /(?:tel\.?|telefon|anrufen|whatsapp|kontakt|call(?:\s+us)?(?:\s+on)?)[:\s]*([+()0-9][0-9 ()/+.-]{6,}[0-9])/giu,
        ) ?? [];

      for (const match of contextMatches) {
        phoneMatches.push(match);
      }
    }
  }

  if (phoneMatches.length === 0) {
    for (const text of textBlocks) {
      const genericPhoneMatches =
        text.match(/(?:^|[^\d])([+()0-9][0-9 ()/+.-]{6,}[0-9])(?=$|[^\d])/gu) ?? [];

      for (const match of genericPhoneMatches) {
        phoneMatches.push(match);
      }
    }
  }

  const cleanedEmails = uniqueBy(
    emailMatches
      .map(normalizeEmail)
      .filter((value): value is string => value !== null),
    (value) => value,
  ).filter((value, _, allValues) => {
    const [localPart, domain] = value.split('@');
    const trimmedLocalPart = localPart.replace(/^\d+/, '');

    if (trimmedLocalPart === localPart) {
      return true;
    }

    return !allValues.includes(`${trimmedLocalPart}@${domain}`);
  });

  const cleanedPhones = uniqueBy(
    phoneMatches
      .map(normalizePhone)
      .filter(isPlausiblePhone),
    toPhoneKey,
  );

  const cleanedAddresses = uniqueBy(
    Array.from(addressMatches)
      .map((value) => expandAddressFromContext(value, textBlocks))
      .filter(isLikelyAddress),
    toAddressKey,
  );

  return {
    emails: cleanedEmails,
    phones: cleanedPhones,
    addresses: cleanedAddresses,
  };
};

export const mergeContactInfo = (...values: ContactInfo[]): ContactInfo => {
  const emails = uniqueBy(
    values
      .flatMap((value) => value.emails)
      .map(normalizeEmail)
      .filter((value): value is string => value !== null),
    (value) => value,
  );

  const phones = uniqueBy(
    values
      .flatMap((value) => value.phones)
      .map(normalizePhone)
      .filter(isPlausiblePhone),
    toPhoneKey,
  );

  const addresses = uniqueBy(
    values
      .flatMap((value) => value.addresses)
      .map(trimAddressToStreet)
      .filter(isLikelyAddress),
    toAddressKey,
  );

  return {
    emails,
    phones,
    addresses,
  };
};
