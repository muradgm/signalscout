import type { Audit } from '../entities/Audit.js';
import type { AuditRepository } from '../ports/AuditRepository.js';

const assertId = (value: string, fieldName: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
};

export class GetAuditByLeadAndSnapshot {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(leadId: string, snapshotId: string): Promise<Audit | null> {
    return this.auditRepository.findLatestByLeadIdAndSnapshotId(
      assertId(leadId, 'Lead id'),
      assertId(snapshotId, 'Snapshot id'),
    );
  }
}
