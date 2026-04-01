import { load } from 'cheerio';
import type { ContactEnrichment, ContactInfo, Lead } from '@signalscout/core';
import { fetchHtml } from '../fetch/fetchHtml.js';
import {
  createContactEnrichment,
  extractContactInfo,
  mergeContactEnrichment,
  mergeContactInfo,
} from '../extract/index.js';
import { extractProviderSpecificContactInfo } from './providerSpecificContactExtractors.js';

const EXTERNAL_PUBLIC_SOURCE_WHITELIST = [
  'jameda.de',
  'doctolib.de',
  '11880.com',
  'gelbeseiten.de',
  'dasoertliche.de',
];

const BROKEN_ADDRESS_PATTERN =
  /^(?:straße|str\.?|strasse|weg|allee|platz|ring|gasse|ufer|damm|chaussee|steig|pfad|markt|kai)\b/i;

const lower = (value: string): string => value.toLowerCase();

const normalizeHost = (value: string): string =>
  value.replace(/^www\./i, '').toLowerCase();

const normalizeWhitespace = (value: string): string =>
  value.replace(/[\u00A0\u2007\u202F]/g, ' ').replace(/\s+/g, ' ').trim();

const isWhitelistedHost = (value: string): boolean => {
  const normalized = normalizeHost(value);

  return EXTERNAL_PUBLIC_SOURCE_WHITELIST.some((host) => {
    return normalized === host || normalized.endsWith(`.${host}`);
  });
};

const isLikelyPlatformOwnedEmail = (email: string): boolean => {
  const normalized = lower(email);

  return (
    normalized.includes('example.') ||
    normalized.includes('beispiel.') ||
    normalized.includes('@mail.com') ||
    normalized.includes('@gmail.com') ||
    normalized.includes('@doctolib.') ||
    normalized.includes('@jameda.')
  );
};

const tokenizeCompanyName = (value: string): string[] => {
  return value
    .split(/[^A-Za-zÄÖÜäöüß0-9]+/u)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 4);
};

const buildSearchQuery = (lead: Lead, sourceHost: string): string => {
  const parts = [
    `"${lead.companyName}"`,
    lead.location,
    'Zahnarzt',
    `site:${sourceHost}`,
  ].filter(Boolean);

  return parts.join(' ');
};

const normalizeAddressCandidate = (value: string): string =>
  normalizeWhitespace(value)
    .replace(/([a-zäöüß])([A-ZÄÖÜ])/gu, '$1 $2')
    .replace(/\b(?:Öffentlicher|Zugangsinformationen|Gebührenpflichtige|Allgemeine|Zu Kontakt)\b[\s\S]*$/iu, '')
    .replace(/\s*[·,]\s*/g, ', ')
    .replace(/\s*[–-]\s*/g, ' - ')
    .trim()
    .replace(/[.,;:]+$/g, '');

const isLikelyCleanExternalAddress = (value: string, lead: Lead): boolean => {
  const normalized = normalizeAddressCandidate(value);

  if (!normalized || /\b(?:doctolib|jameda)\b/i.test(normalized)) {
    return false;
  }

  if (!normalized.includes(lead.location)) {
    return false;
  }

  if (/\b(?:Öffentlicher|Zugangsinformationen|Gebührenpflichtige|Allgemeine|Zu Kontakt|uhr)\b/i.test(normalized)) {
    return false;
  }

  return /\d{1,4}[A-Za-z]?(?:\s*,)?\s+\d{5}\s+[A-ZÄÖÜ][\p{L}.'-]+/u.test(normalized);
};

const keepPromotableExternalEmails = (lead: Lead, emails: string[]): string[] => {
  const leadHost = normalizeHost(new URL(lead.website).hostname);

  return emails.filter((email) => {
    const normalized = lower(email);
    const domain = normalizeHost(normalized.split('@')[1] ?? '');

    if (!normalized || isLikelyPlatformOwnedEmail(normalized)) {
      return false;
    }

    return domain === leadHost || domain.endsWith(`.${leadHost}`);
  });
};

const keepPromotableExternalAddresses = (lead: Lead, addresses: string[]): string[] => {
  return addresses
    .map(normalizeAddressCandidate)
    .filter((value) => isLikelyCleanExternalAddress(value, lead))
    .slice(0, 1);
};

const selectExternalContactInfo = (resultHtml: string, finalResultUrl: string): ContactInfo => {
  const providerSpecific = extractProviderSpecificContactInfo(resultHtml, finalResultUrl);
  const generic = extractContactInfo(resultHtml);

  return mergeContactInfo(providerSpecific, generic);
};

const extractDuckDuckGoResultUrls = (html: string): string[] => {
  const $ = load(html);
  const urls = new Set<string>();

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');

    if (!href) {
      return;
    }

    try {
      const parsed = new URL(href, 'https://duckduckgo.com');
      const redirected = parsed.searchParams.get('uddg');
      const target = redirected ?? (href.startsWith('http') ? href : '');

      if (!target) {
        return;
      }

      const targetUrl = new URL(target);

      if (isWhitelistedHost(targetUrl.hostname)) {
        urls.add(targetUrl.toString());
      }
    } catch {
      // Ignore malformed URLs.
    }
  });

  return [...urls];
};

const isLikelyRelevantListing = (html: string, lead: Lead): boolean => {
  const text = load(html)('body').text().toLowerCase();
  const companyTokens = tokenizeCompanyName(lead.companyName);
  const hasCompanyMatch = companyTokens.some((token) => text.includes(token));
  const hasLocationMatch = text.includes(lead.location.toLowerCase());

  return hasCompanyMatch && hasLocationMatch;
};

const shouldPromoteExternalEmails = (contactInfo: ContactInfo): boolean =>
  contactInfo.emails.length === 0;

const shouldPromoteExternalPhones = (contactInfo: ContactInfo): boolean =>
  contactInfo.phones.length === 0;

const shouldPromoteExternalAddresses = (contactInfo: ContactInfo): boolean =>
  contactInfo.addresses.length === 0 ||
  contactInfo.addresses.some((value) =>
    BROKEN_ADDRESS_PATTERN.test(value) ||
    /\b(?:zu kontakt|uhr|geöffnet|geoeffnet)\b/i.test(value),
  );

const keepPromotableExternalInfo = (
  lead: Lead,
  primaryContactInfo: ContactInfo,
  externalContactInfo: ContactInfo,
): ContactInfo => {
  return {
    emails: shouldPromoteExternalEmails(primaryContactInfo)
      ? keepPromotableExternalEmails(lead, externalContactInfo.emails)
      : [],
    phones: shouldPromoteExternalPhones(primaryContactInfo) ? externalContactInfo.phones : [],
    addresses: shouldPromoteExternalAddresses(primaryContactInfo)
      ? keepPromotableExternalAddresses(lead, externalContactInfo.addresses)
      : [],
  };
};

export const enrichFromExternalPublicSources = async (
  lead: Lead,
  primaryContactInfo: ContactInfo,
  seedUrls: string[] = [],
): Promise<{
  promotedContactInfo: ContactInfo;
  enrichment: ContactEnrichment;
}> => {
  const directResultUrls = Array.from(
    new Set(
      seedUrls.filter((value) => {
        try {
          return isWhitelistedHost(new URL(value).hostname);
        } catch {
          return false;
        }
      }),
    ),
  );
  const searchUrls = EXTERNAL_PUBLIC_SOURCE_WHITELIST.map((sourceHost) => {
    const query = encodeURIComponent(buildSearchQuery(lead, sourceHost));
    return `https://html.duckduckgo.com/html/?q=${query}`;
  });

  const collectedContactInfos: ContactInfo[] = [];
  const collectedMetadata: ContactEnrichment[] = [];
  const visitedResultUrls = new Set<string>();

  const processResultUrl = async (resultUrl: string): Promise<void> => {
    try {
      const { html: resultHtml, url: finalResultUrl } = await fetchHtml(resultUrl);

      if (visitedResultUrls.has(finalResultUrl)) {
        return;
      }

      visitedResultUrls.add(finalResultUrl);

      if (!isLikelyRelevantListing(resultHtml, lead)) {
        return;
      }

      const extracted = selectExternalContactInfo(resultHtml, finalResultUrl);
      const promotable = keepPromotableExternalInfo(lead, primaryContactInfo, extracted);
      const hasAnyPromotableValue =
        promotable.emails.length > 0 ||
        promotable.phones.length > 0 ||
        promotable.addresses.length > 0;

      if (!hasAnyPromotableValue) {
        return;
      }

      collectedContactInfos.push(promotable);
      collectedMetadata.push(
        createContactEnrichment(
          promotable,
          'external_public',
          finalResultUrl,
          'low',
        ),
      );
    } catch {
      // Ignore failing public listing pages.
    }
  };

  for (const resultUrl of directResultUrls) {
    await processResultUrl(resultUrl);
  }

  for (const searchUrl of searchUrls) {
    try {
      const { html: searchHtml } = await fetchHtml(searchUrl);
      const resultUrls = extractDuckDuckGoResultUrls(searchHtml).slice(0, 2);

      for (const resultUrl of resultUrls) {
        await processResultUrl(resultUrl);
      }
    } catch {
      // Ignore failing search requests and continue with the rest of the whitelist.
    }
  }

  return {
    promotedContactInfo: mergeContactInfo(...collectedContactInfos),
    enrichment: mergeContactEnrichment(...collectedMetadata),
  };
};
