import type {
  OutreachChannel,
  OutreachMessage,
  OutreachRecommendationType,
  OutreachStatus,
} from '../entities/OutreachMessage.js';

export interface SaveOutreachInput {
  leadId: string;
  auditId: string;

  channel: OutreachChannel;

  recommendation: OutreachRecommendationType;

  fitReason: string;
  bestAngle: string;

  subject: string | null;
  body: string | null;

  reasoning: string;
  evidence: string[];

  status: OutreachStatus;
}

export interface OutreachRepository {
  save(input: SaveOutreachInput): Promise<OutreachMessage>;
  findLatestByLeadId(leadId: string): Promise<OutreachMessage | null>;
}