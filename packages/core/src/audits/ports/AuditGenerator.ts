import type { Lead, LeadSnapshot, SignalSet } from '../../index.js';

export interface GenerateAuditInput {
  lead: Lead;
  snapshot: LeadSnapshot;
  signals: SignalSet;
}

export interface GeneratedAuditDraft {
  summary: string;

  strengths: string[];
  opportunities: string[];
  opportunityDetails: string[];
  risks: string[];

  recommendedAngle: string;
  confidenceNote: string;
  quickWins: string[];
  outreachHook: string;


  evidence: string[];
}

export interface AuditGenerator {
  generate(input: GenerateAuditInput): Promise<GeneratedAuditDraft>;
}