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
    bookingLinks: document.bookingLinks,
    trustSignals: document.trustSignals,
    isPlaceholderContent: document.isPlaceholderContent,
    extractedAt: document.extractedAt,
  };
};