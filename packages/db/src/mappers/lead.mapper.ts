import type { Lead, LeadCompleteness } from '@signalscout/core';
import type { HydratedDocument } from 'mongoose';
import type { LeadDocument } from '../models/LeadModel.js';

const deriveLeadCompleteness = (
  document: HydratedDocument<LeadDocument>,
): LeadCompleteness => {
  const hasCountry = typeof document.country === 'string' && document.country.trim().length > 0;
  const hasSource = typeof document.source === 'string' && document.source.trim().length > 0;

  if (hasCountry && hasSource) {
    return 'complete';
  }

  if (!hasCountry && !hasSource) {
    return 'legacy_incomplete';
  }

  return 'partial';
};

export const mapLeadDocumentToEntity = (
  document: HydratedDocument<LeadDocument>,
): Lead => {
  return {
    id: document._id.toString(),
    companyName: document.companyName,
    website: document.website,
    niche: document.niche,
    location: document.location,
    country: document.country,
    source: document.source,
    status: document.status,
    completeness: deriveLeadCompleteness(document),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
};