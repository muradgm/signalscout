import type { LeadSnapshot } from '../entities/LeadSnapshot.js';
import type { LeadSnapshotRepository } from '../ports/LeadSnapshotRepository.js';

const assertSnapshotId = (snapshotId: string): string => {
  const normalized = snapshotId.trim();

  if (!normalized) {
    throw new Error('Snapshot id is required');
  }

  return normalized;
};

export class GetLeadSnapshotById {
  constructor(
    private readonly leadSnapshotRepository: LeadSnapshotRepository,
  ) {}

  async execute(snapshotId: string): Promise<LeadSnapshot | null> {
    const normalizedSnapshotId = assertSnapshotId(snapshotId);

    return this.leadSnapshotRepository.findById(normalizedSnapshotId);
  }
}
