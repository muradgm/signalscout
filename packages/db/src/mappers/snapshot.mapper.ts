import type { LeadSnapshot } from '@signalscout/core';
import type { HydratedDocument } from 'mongoose';
import type { LeadSnapshotDocument } from '../models/LeadSnapshotModel.js';

export const mapLeadSnapshotDocumentToEntity = (
  document: HydratedDocument<LeadSnapshotDocument>,
): LeadSnapshot => {
  return {
    id: document._id.toString(),
    leadId: document.leadId.toString(),
    url: document.url,
    pageTitle: document.pageTitle,
    metaDescription: document.metaDescription,
    visibleText: document.visibleText,
    contactInfo: {
      emails: document.contactInfo.emails,
      phones: document.contactInfo.phones,
      addresses: document.contactInfo.addresses,
    },
    contactEnrichment: {
      emails: document.contactEnrichment.emails.map((item) => ({
        type: item.type as 'email',
        value: item.value,
        sourceKind: item.sourceKind as 'main_page' | 'official_site' | 'external_public',
        sourceUrl: item.sourceUrl,
        confidence: item.confidence as 'high' | 'medium' | 'low',
      })),
      phones: document.contactEnrichment.phones.map((item) => ({
        type: item.type as 'phone',
        value: item.value,
        sourceKind: item.sourceKind as 'main_page' | 'official_site' | 'external_public',
        sourceUrl: item.sourceUrl,
        confidence: item.confidence as 'high' | 'medium' | 'low',
      })),
      addresses: document.contactEnrichment.addresses.map((item) => ({
        type: item.type as 'address',
        value: item.value,
        sourceKind: item.sourceKind as 'main_page' | 'official_site' | 'external_public',
        sourceUrl: item.sourceUrl,
        confidence: item.confidence as 'high' | 'medium' | 'low',
      })),
    },
    bookingLinks: document.bookingLinks,
    trustSignals: document.trustSignals,
    isPlaceholderContent: document.isPlaceholderContent,
    extractedAt: document.extractedAt,
  };
};
