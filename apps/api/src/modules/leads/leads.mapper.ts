import type { Lead, LeadSnapshot, SignalSet } from '@signalscout/core';

export const mapLeadToResponse = (lead: Lead) => {
  return {
    id: lead.id,
    companyName: lead.companyName,
    website: lead.website,
    niche: lead.niche,
    location: lead.location,
    country: lead.country,
    source: lead.source,
    status: lead.status,
    completeness: lead.completeness,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
};

export const mapLeadSnapshotToResponse = (snapshot: LeadSnapshot) => {
  return {
    id: snapshot.id,
    leadId: snapshot.leadId,
    url: snapshot.url,
    pageTitle: snapshot.pageTitle,
    metaDescription: snapshot.metaDescription,
    visibleText: snapshot.visibleText,
    contactInfo: snapshot.contactInfo,
    bookingLinks: snapshot.bookingLinks,
    trustSignals: snapshot.trustSignals,
    isPlaceholderContent: snapshot.isPlaceholderContent,
    extractedAt: snapshot.extractedAt.toISOString(),
  };
};

export const mapSignalSetToResponse = (signals: SignalSet) => {
  return {
    bookingPresence: signals.bookingPresence,
    contactClarity: signals.contactClarity,
    trustSignalStrength: signals.trustSignalStrength,
    businessScale: signals.businessScale,
    localRelevance: signals.localRelevance,
    outreachFit: signals.outreachFit,
    fitReason: signals.fitReason,
    confidence: signals.confidence,
    leadCompleteness: signals.leadCompleteness,
    issuesDetected: signals.issuesDetected,
    evidence: signals.evidence,
  };
};