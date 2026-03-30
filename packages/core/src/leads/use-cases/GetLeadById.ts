import type { Lead } from '../entities/Lead.js';
import type { LeadRepository } from '../ports/LeadRepository.js';

const assertLeadId = (leadId: string): string => {
  const normalized = leadId.trim();

  if (!normalized) {
    throw new Error('Lead id is required');
  }

  return normalized;
};

export class GetLeadById {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(leadId: string): Promise<Lead | null> {
    return this.leadRepository.findById(assertLeadId(leadId));
  }
}