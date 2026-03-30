import type { Audit } from '../entities/Audit.js';

export interface SaveAuditInput {
  leadId: string;
  snapshotId: string;

  summary: string;

  strengths: string[];
  opportunities: string[];
  opportunityDetails: string[];
  risks: string[];

  recommendedAngle: string;
  confidenceNote: string;

  evidence: string[];
}

export interface AuditRepository {
  save(input: SaveAuditInput): Promise<Audit>;
  findLatestByLeadId(leadId: string): Promise<Audit | null>;
}