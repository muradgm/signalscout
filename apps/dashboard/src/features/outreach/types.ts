export type Outreach = {
  id: string;
  leadId: string;
  auditId: string;
  channel: string;
  recommendation: string;
  status: string;
  fitReason: string;
  bestAngle: string;
  subject: string | null;
  body: string | null;
  reasoning: string;
  evidence: string[];
  createdAt: string;
};
