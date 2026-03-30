import type { Audit } from '@signalscout/core';

export const mapAuditToResponse = (audit: Audit) => {
  return {
    id: audit.id,
    leadId: audit.leadId,
    snapshotId: audit.snapshotId,
    summary: audit.summary,
    strengths: audit.strengths,
    opportunities: audit.opportunities,
    opportunityDetails: audit.opportunityDetails,
    risks: audit.risks,
    recommendedAngle: audit.recommendedAngle,
    confidenceNote: audit.confidenceNote,
    evidence: audit.evidence,
    createdAt: audit.createdAt.toISOString(),
  };
};