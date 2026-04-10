import type { Audit } from '../entities/Audit.js';
import type { AuditRepository } from '../ports/AuditRepository.js';

const assertAuditId = (auditId: string): string => {
  const normalized = auditId.trim();

  if (!normalized) {
    throw new Error('Audit id is required');
  }

  return normalized;
};

export class GetAuditById {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(auditId: string): Promise<Audit | null> {
    const normalizedAuditId = assertAuditId(auditId);

    return this.auditRepository.findById(normalizedAuditId);
  }
}
