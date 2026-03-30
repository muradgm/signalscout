import type { Audit } from '../entities/Audit.js';
import type { AuditRepository } from '../ports/AuditRepository.js';

const assertLeadId = (leadId: string): string => {
  const normalized = leadId.trim();

  if (!normalized) {
    throw new Error('Lead id is required');
  }

  return normalized;
};

export class GetAuditByLead {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(leadId: string): Promise<Audit | null> {
    return this.auditRepository.findLatestByLeadId(assertLeadId(leadId));
  }
}