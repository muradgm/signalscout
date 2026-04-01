import { load } from 'cheerio';
import type { ContactInfo } from '@signalscout/core';
import { mergeContactInfo, extractContactInfo } from '../extract/index.js';

type StructuredAddress = {
  streetAddress?: string;
  postalCode?: string;
  addressLocality?: string;
};

const normalizeHost = (value: string): string =>
  value.replace(/^www\./i, '').toLowerCase();

const normalizeWhitespace = (value: string): string =>
  value.replace(/[\u00A0\u2007\u202F]/g, ' ').replace(/\s+/g, ' ').trim();

const toArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseStructuredDataBlocks = (html: string): unknown[] => {
  const $ = load(html);
  const values: unknown[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).contents().text().trim();

    if (!raw) {
      return;
    }

    try {
      values.push(JSON.parse(raw));
    } catch {
      // Ignore malformed structured data blocks.
    }
  });

  return values;
};

const readAddressValue = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return [normalizeWhitespace(value)];
  }

  if (!isObject(value)) {
    return [];
  }

  const structured = value as StructuredAddress;
  const parts = [
    structured.streetAddress,
    structured.postalCode && structured.addressLocality
      ? `${structured.postalCode} ${structured.addressLocality}`
      : structured.postalCode ?? structured.addressLocality,
  ]
    .filter(Boolean)
    .map((part) => normalizeWhitespace(String(part)));

  if (parts.length === 0) {
    return [];
  }

  return [parts.join(' ')];
};

const collectStructuredDataAddresses = (node: unknown): string[] => {
  if (!node) {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap(collectStructuredDataAddresses);
  }

  if (!isObject(node)) {
    return [];
  }

  const record = node as Record<string, unknown>;
  const localAddresses = [
    ...readAddressValue(record.address),
    ...toArray(record.location).flatMap((value) =>
      readAddressValue(isObject(value) ? value.address ?? value : value),
    ),
  ];
  const nestedAddresses = Object.values(record)
    .filter((value) => isObject(value) || Array.isArray(value))
    .flatMap(collectStructuredDataAddresses);

  return [...new Set([...localAddresses, ...nestedAddresses].map(normalizeWhitespace))];
};

const collectStructuredDataContactInfo = (node: unknown): ContactInfo => {
  if (!node) {
    return { emails: [], phones: [], addresses: [] };
  }

  if (Array.isArray(node)) {
    return mergeContactInfo(...node.map(collectStructuredDataContactInfo));
  }

  if (!isObject(node)) {
    return { emails: [], phones: [], addresses: [] };
  }

  const record = node as Record<string, unknown>;
  const nestedValues = Object.values(record)
    .filter((value) => isObject(value) || Array.isArray(value))
    .map(collectStructuredDataContactInfo);

  const localInfo: ContactInfo = {
    emails: toArray(record.email)
      .filter((value): value is string => typeof value === 'string')
      .map(normalizeWhitespace),
    phones: [...toArray(record.telephone), ...toArray(record.phone)]
      .filter((value): value is string => typeof value === 'string')
      .map(normalizeWhitespace),
    addresses: [
      ...readAddressValue(record.address),
      ...toArray(record.location)
        .flatMap((value) => readAddressValue(isObject(value) ? value.address ?? value : value)),
    ],
  };

  return mergeContactInfo(localInfo, ...nestedValues);
};

const renderScopedFragments = ($: ReturnType<typeof load>, selectors: string[]): string => {
  const fragments: string[] = [];

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const html = $.html(element);

      if (html) {
        fragments.push(html);
      }
    });
  }

  return fragments.join('\n');
};

const extractJamedaContactInfo = (html: string): ContactInfo => {
  const $ = load(html);
  const structuredBlocks = parseStructuredDataBlocks(html);
  const scopedHtml = renderScopedFragments($, [
    'main',
    'address',
    '[data-testid*="address"]',
    '[class*="address"]',
    '[data-testid*="contact"]',
    '[class*="contact"]',
    '[class*="location"]',
  ]);

  const scopedInfo = scopedHtml ? extractContactInfo(scopedHtml) : { emails: [], phones: [], addresses: [] };
  const structuredInfo = mergeContactInfo(...structuredBlocks.map(collectStructuredDataContactInfo));
  const structuredAddresses = [...new Set(structuredBlocks.flatMap(collectStructuredDataAddresses))];
  const merged = mergeContactInfo(structuredInfo, scopedInfo);

  return {
    ...merged,
    addresses: structuredAddresses.length > 0 ? structuredAddresses : merged.addresses,
  };
};

const extractDoctolibContactInfo = (html: string): ContactInfo => {
  const $ = load(html);
  const structuredBlocks = parseStructuredDataBlocks(html);
  const scopedHtml = renderScopedFragments($, [
    'main',
    'address',
    '[data-testid*="address"]',
    '[data-testid*="phone"]',
    '[class*="address"]',
    '[class*="phone"]',
    '[class*="contact"]',
    '[class*="location"]',
  ]);

  const scopedInfo = scopedHtml ? extractContactInfo(scopedHtml) : { emails: [], phones: [], addresses: [] };
  const structuredInfo = mergeContactInfo(...structuredBlocks.map(collectStructuredDataContactInfo));
  const structuredAddresses = [...new Set(structuredBlocks.flatMap(collectStructuredDataAddresses))];
  const merged = mergeContactInfo(structuredInfo, scopedInfo);

  return {
    ...merged,
    addresses: structuredAddresses.length > 0 ? structuredAddresses : merged.addresses,
  };
};

export const extractProviderSpecificContactInfo = (
  html: string,
  pageUrl: string,
): ContactInfo => {
  const host = normalizeHost(new URL(pageUrl).hostname);

  if (host === 'jameda.de' || host.endsWith('.jameda.de')) {
    return extractJamedaContactInfo(html);
  }

  if (host === 'doctolib.de' || host.endsWith('.doctolib.de')) {
    return extractDoctolibContactInfo(html);
  }

  return { emails: [], phones: [], addresses: [] };
};
