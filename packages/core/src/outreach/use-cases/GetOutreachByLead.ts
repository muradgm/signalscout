import type { OutreachMessage } from '../entities/OutreachMessage.js';
import type { OutreachRepository } from '../ports/OutreachRepository.js';

const assertLeadId = (leadId: string): string => {
  const normalized = leadId.trim();

  if (!normalized) {
    throw new Error('Lead id is required');
  }

  return normalized;
};

export class GetOutreachByLead {
  constructor(private readonly outreachRepository: OutreachRepository) {}

  async execute(leadId: string): Promise<OutreachMessage | null> {
    return this.outreachRepository.findLatestByLeadId(assertLeadId(leadId));
  }
}