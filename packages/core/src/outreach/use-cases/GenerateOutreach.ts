import type { OutreachMessage } from '../entities/OutreachMessage.js';
import type {
  GenerateOutreachInput,
  OutreachGenerator,
} from '../ports/OutreachGenerator.js';
import type { OutreachRepository } from '../ports/OutreachRepository.js';

const assertNonEmptyString = (value: string, fieldName: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
};

const normalizeNullableString = (value: string | null): string | null => {
  if (value === null) {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
};

const normalizeStringArray = (values: string[], fieldName: string): string[] => {
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

const resolveStatus = (
  recommendation: 'send' | 'review' | 'do_not_send',
): 'drafted' | 'review_required' | 'withheld' => {
  if (recommendation === 'send') {
    return 'drafted';
  }

  if (recommendation === 'review') {
    return 'review_required';
  }

  return 'withheld';
};

export class GenerateOutreach {
  constructor(
    private readonly outreachGenerator: OutreachGenerator,
    private readonly outreachRepository: OutreachRepository,
  ) {}

  async execute(input: GenerateOutreachInput): Promise<OutreachMessage> {
    const regenerationIndex = await this.outreachRepository.countByLeadIdAndAuditId(
      input.lead.id,
      input.audit.id,
    );
    const draft = await this.outreachGenerator.generate({
      ...input,
      regenerationIndex,
    });

    const fitReason = assertNonEmptyString(draft.fitReason, 'Outreach fit reason');
    const bestAngle = assertNonEmptyString(draft.bestAngle, 'Outreach best angle');
    const reasoning = assertNonEmptyString(draft.reasoning, 'Outreach reasoning');
    const evidence = normalizeStringArray(draft.evidence, 'Outreach evidence');

    return this.outreachRepository.save({
      leadId: input.lead.id,
      auditId: input.audit.id,
      channel: 'email',
      recommendation: draft.recommendation,
      fitReason,
      bestAngle,
      generatedSubject: normalizeNullableString(draft.subject),
      generatedBody: normalizeNullableString(draft.body),
      subject: normalizeNullableString(draft.subject),
      body: normalizeNullableString(draft.body),
      reasoning,
      evidence,
      status: resolveStatus(draft.recommendation),
      reviewStatus: 'not_reviewed',
      reviewedAt: null,
      sentAt: null,
      sendAttemptCount: 0,
      lastSendAttemptAt: null,
      lastSendErrorCode: null,
      lastSendError: null,
      lastSendRetryable: false,
      deliveryProvider: null,
      providerMessageId: null,
    });
  }
}
