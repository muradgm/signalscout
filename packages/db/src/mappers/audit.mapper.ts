import type { Audit } from '@signalscout/core';
import type { HydratedDocument } from 'mongoose';
import type { AuditDocument } from '../models/AuditModel.js';

export const mapAuditDocumentToEntity = (
  document: HydratedDocument<AuditDocument>,
): Audit => {
  return {
    id: document._id.toString(),
    leadId: document.leadId.toString(),
    snapshotId: document.snapshotId.toString(),
    summary: document.summary,
    strengths: document.strengths,
    opportunities: document.opportunities,
    opportunityDetails: document.opportunityDetails,
    risks: document.risks,
    recommendedAngle: document.recommendedAngle,
    confidenceNote: document.confidenceNote,
    evidence: document.evidence,
    createdAt: document.createdAt,
  };
};