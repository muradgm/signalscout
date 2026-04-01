import type {
  ExtractedLeadSnapshotData,
  Lead,
  LeadSnapshotExtractor,
} from '@signalscout/core';
import { load } from 'cheerio';
import { fetchHtml } from '../fetch/fetchHtml.js';
import {
  createContactEnrichment,
  extractContactInfo,
  mergeContactEnrichment,
  mergeContactInfo,
} from '../extract/index.js';
import { buildLeadSnapshot } from '../snapshots/buildLeadSnapshot.js';
import { enrichFromExternalPublicSources } from './externalPublicContactEnricher.js';

const OFFICIAL_CONTACT_PATH_KEYWORDS = [
  'impressum',
  'kontakt',
  'contact',
  'imprint',
  'datenschutz',
  'privacy',
];

const buildOfficialContactPageCandidates = (
  html: string,
  finalUrl: string,
): string[] => {
  const $ = load(html);
  const baseUrl = new URL(finalUrl);
  const candidates = new Set<string>();

  const addCandidate = (value: string): void => {
    try {
      const resolved = new URL(value, baseUrl);

      if (resolved.origin !== baseUrl.origin) {
        return;
      }

      if (!/^https?:$/i.test(resolved.protocol)) {
        return;
      }

      candidates.add(resolved.toString());
    } catch {
      // Ignore malformed URLs.
    }
  };

  for (const keyword of OFFICIAL_CONTACT_PATH_KEYWORDS) {
    addCandidate(`/${keyword}`);
    addCandidate(`/${keyword}/`);
    addCandidate(`/${keyword}.html`);
    addCandidate(`/${keyword}.php`);
  }

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');

    if (!href) {
      return;
    }

    const loweredHref = href.toLowerCase();

    if (OFFICIAL_CONTACT_PATH_KEYWORDS.some((keyword) => loweredHref.includes(keyword))) {
      addCandidate(href);
    }
  });

  candidates.delete(finalUrl);

  return [...candidates].slice(0, 12);
};

const shouldEnrichContactInfo = (snapshot: ExtractedLeadSnapshotData): boolean => {
  return (
    snapshot.contactInfo.emails.length === 0 ||
    snapshot.contactInfo.addresses.length === 0
  );
};

const normalizeHost = (value: string): string =>
  value.replace(/^www\./i, '').toLowerCase();

const isOfficialEmailForSite = (email: string, finalUrl: string): boolean => {
  const siteHost = normalizeHost(new URL(finalUrl).hostname);
  const emailDomain = normalizeHost(email.split('@')[1] ?? '');

  return emailDomain === siteHost || emailDomain.endsWith(`.${siteHost}`);
};

const isLikelyPrimaryPracticeAddress = (address: string): boolean => {
  const lowered = address.toLowerCase();

  return ![
    'kammer',
    'körperschaft',
    'koerperschaft',
    'aufsicht',
    'aufsichtsbehörde',
    'aufsichtsbehoerde',
    'zuständige',
    'zustaendige',
    'senatsverwaltung',
    'stallstraße',
    'stallstrasse',
  ].some((fragment) => lowered.includes(fragment));
};

export class WebsiteLeadSnapshotExtractor implements LeadSnapshotExtractor {
  async extract(lead: Lead): Promise<ExtractedLeadSnapshotData> {
    const { url: finalUrl, html } = await fetchHtml(lead.website);
    const snapshot = buildLeadSnapshot(html, finalUrl);

    if (!shouldEnrichContactInfo(snapshot)) {
      return snapshot;
    }

    const candidates = buildOfficialContactPageCandidates(html, finalUrl);
    const enrichedContactInfos = [snapshot.contactInfo];
    const enrichedContactMetadata = [snapshot.contactEnrichment];

    for (const candidateUrl of candidates) {
      try {
        const { html: candidateHtml } = await fetchHtml(candidateUrl);
        const contactInfo = extractContactInfo(candidateHtml);
        const filteredContactInfo = {
          emails: contactInfo.emails.filter((email) =>
            isOfficialEmailForSite(email, finalUrl),
          ),
          phones: snapshot.contactInfo.phones.length === 0 ? contactInfo.phones : [],
          addresses:
            snapshot.contactInfo.addresses.length === 0
              ? contactInfo.addresses.filter(isLikelyPrimaryPracticeAddress).slice(0, 1)
              : [],
        };

        const hasUsefulContactData =
          filteredContactInfo.emails.length > 0 ||
          filteredContactInfo.phones.length > 0 ||
          filteredContactInfo.addresses.length > 0;

        if (hasUsefulContactData) {
          enrichedContactInfos.push(filteredContactInfo);
          enrichedContactMetadata.push(
            createContactEnrichment(
              filteredContactInfo,
              'official_site',
              candidateUrl,
              'high',
            ),
          );
        }
      } catch {
        // Ignore candidate fetch failures and keep the main-page extraction.
      }
    }

    const officialEnrichedSnapshot = {
      ...snapshot,
      contactInfo: mergeContactInfo(...enrichedContactInfos),
      contactEnrichment: mergeContactEnrichment(...enrichedContactMetadata),
    };

    const externalFallback = await enrichFromExternalPublicSources(
      lead,
      officialEnrichedSnapshot.contactInfo,
      officialEnrichedSnapshot.bookingLinks,
    );

    return {
      ...officialEnrichedSnapshot,
      contactInfo: mergeContactInfo(
        officialEnrichedSnapshot.contactInfo,
        externalFallback.promotedContactInfo,
      ),
      contactEnrichment: mergeContactEnrichment(
        officialEnrichedSnapshot.contactEnrichment,
        externalFallback.enrichment,
      ),
    };
  }
}
