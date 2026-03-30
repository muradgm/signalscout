import type { ExtractedLeadSnapshotData } from '@signalscout/core';
import { detectPlaceholderContent } from '../detect/detectPlaceholderContent.js';
import { extractBookingLinks } from '../extract/extractBookingLinks.js';
import { extractContactInfo } from '../extract/extractContactInfo.js';
import { extractMetadata } from '../extract/extractMetadata.js';
import { extractTrustSignals } from '../extract/extractTrustSignals.js';
import { extractVisibleText } from '../extract/extractVisibleText.js';

export const buildLeadSnapshot = (
  html: string,
  finalUrl: string,
): ExtractedLeadSnapshotData => {
  const { pageTitle, metaDescription } = extractMetadata(html);
  const visibleText = extractVisibleText(html);
  const isPlaceholderContent = detectPlaceholderContent(visibleText);

  const contactInfo = extractContactInfo(html);
  const bookingLinks = isPlaceholderContent
    ? []
    : extractBookingLinks(html, finalUrl);
  const trustSignals = isPlaceholderContent
    ? []
    : extractTrustSignals(visibleText);

  return {
    url: finalUrl,
    pageTitle,
    metaDescription,
    visibleText,
    contactInfo,
    bookingLinks,
    trustSignals,
    isPlaceholderContent,
    extractedAt: new Date(),
  };
};