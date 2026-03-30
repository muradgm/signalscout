import type { Audit } from '../../audits/entities/Audit.js';
import type { Lead } from '../../leads/entities/Lead.js';
import type { LeadSnapshot } from '../../leads/entities/LeadSnapshot.js';
import type { SignalSet } from '../../signals/entities/SignalSet.js';
import type {
  OutreachRecommendationType,
} from '../entities/OutreachMessage.js';

export interface GenerateOutreachInput {
  lead: Lead;
  snapshot: LeadSnapshot;
  signals: SignalSet;
  audit: Audit;
}

export interface GeneratedOutreachDraft {
  recommendation: OutreachRecommendationType;

  fitReason: string;
  bestAngle: string;

  subject: string | null;
  body: string | null;

  reasoning: string;
  evidence: string[];
}

export interface OutreachGenerator {
  generate(input: GenerateOutreachInput): Promise<GeneratedOutreachDraft>;
}