export type Audit = {
  id: string;
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
  createdAt: string;
};
