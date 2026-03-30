import type { LeadSnapshot } from '../entities/LeadSnapshot.js';
import type { LeadSnapshotRepository } from '../ports/LeadSnapshotRepository.js';

const assertLeadId = (leadId: string): string => {
  const normalized = leadId.trim();

  if (!normalized) {
    throw new Error('Lead id is required');
  }

  return normalized;
};

export class GetLatestLeadSnapshot {
  constructor(
    private readonly leadSnapshotRepository: LeadSnapshotRepository,
  ) {}

  async execute(leadId: string): Promise<LeadSnapshot | null> {
    return this.leadSnapshotRepository.findLatestByLeadId(assertLeadId(leadId));
  }
}