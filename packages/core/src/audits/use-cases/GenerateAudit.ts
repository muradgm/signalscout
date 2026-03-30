import type { Audit } from '../entities/Audit.js';
import type { AuditGenerator, GenerateAuditInput } from '../ports/AuditGenerator.js';
import type { AuditRepository } from '../ports/AuditRepository.js';

const assertNonEmptyString = (value: string, fieldName: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
};

const normalizeStringArray = (values: string[], fieldName: string): string[] => {
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

export class GenerateAudit {
  constructor(
    private readonly auditGenerator: AuditGenerator,
    private readonly auditRepository: AuditRepository,
  ) {}

  async execute(input: GenerateAuditInput): Promise<Audit> {
    const draft = await this.auditGenerator.generate(input);

    const summary = assertNonEmptyString(draft.summary, 'Audit summary');
    const strengths = normalizeStringArray(draft.strengths, 'Audit strengths');
    const opportunities = normalizeStringArray(
      draft.opportunities,
      'Audit opportunities',
    );
    const opportunityDetails = normalizeStringArray(
      draft.opportunityDetails,
      'Audit opportunity details',
    );
    const risks = normalizeStringArray(draft.risks, 'Audit risks');
    const recommendedAngle = assertNonEmptyString(
      draft.recommendedAngle,
      'Audit recommended angle',
    );
    const confidenceNote = assertNonEmptyString(
      draft.confidenceNote,
      'Audit confidence note',
    );
    const evidence = normalizeStringArray(draft.evidence, 'Audit evidence');

    return this.auditRepository.save({
      leadId: input.lead.id,
      snapshotId: input.snapshot.id,
      summary,
      strengths,
      opportunities,
      opportunityDetails,
      risks,
      recommendedAngle,
      confidenceNote,
      evidence,
    });
  }
}