export type LeadStatus =
  | 'new'
  | 'snapshot_pending'
  | 'snapshot_ready'
  | 'audit_ready'
  | 'contacted'
  | 'replied'
  | 'closed';

export type LeadNiche = 'dentist';

export type LeadSource = 'manual' | 'import';

export type LeadCompleteness = 'complete' | 'partial' | 'legacy_incomplete';

export interface Lead {
  id: string;
  companyName: string;
  website: string;
  niche: LeadNiche;
  location: string;
  country?: string;
  source?: LeadSource;
  status: LeadStatus;
  completeness: LeadCompleteness;
  createdAt: Date;
  updatedAt: Date;
}