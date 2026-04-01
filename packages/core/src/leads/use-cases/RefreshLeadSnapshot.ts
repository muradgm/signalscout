import type { LeadSnapshot } from '../entities/LeadSnapshot.js';
import type { LeadRepository } from '../ports/LeadRepository.js';
import type { LeadSnapshotExtractor } from '../ports/LeadSnapshotExtractor.js';
import type { LeadSnapshotRepository } from '../ports/LeadSnapshotRepository.js';

const assertLeadId = (leadId: string): string => {
  const normalized = leadId.trim();

  if (!normalized) {
    throw new Error('Lead id is required');
  }

  return normalized;
};

export class RefreshLeadSnapshot {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly leadSnapshotRepository: LeadSnapshotRepository,
    private readonly leadSnapshotExtractor: LeadSnapshotExtractor,
  ) {}

  async execute(leadId: string): Promise<LeadSnapshot> {
    const normalizedLeadId = assertLeadId(leadId);

    const lead = await this.leadRepository.findById(normalizedLeadId);

    if (!lead) {
      throw new Error('Lead not found');
    }

    const snapshot = await this.leadSnapshotExtractor.extract(lead);

    return this.leadSnapshotRepository.save({
      leadId: normalizedLeadId,
      snapshot,
    });
  }
}
