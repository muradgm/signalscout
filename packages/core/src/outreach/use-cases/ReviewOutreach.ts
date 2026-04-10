import type { OutreachMessage, OutreachReviewStatus, OutreachStatus } from '../entities/OutreachMessage.js';
import type { OutreachRepository } from '../ports/OutreachRepository.js';

export type ReviewOutreachAction = 'accepted' | 'edited' | 'skipped';

export type ReviewOutreachInput = {
  outreachId: string;
  action: ReviewOutreachAction;
  subject?: string | null;
  body?: string | null;
};

const assertNonEmpty = (value: string, fieldName: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
};

const normalizeOptional = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const resolveStatuses = (
  action: ReviewOutreachAction,
): { reviewStatus: OutreachReviewStatus; status: OutreachStatus } => {
  if (action === 'accepted') {
    return { reviewStatus: 'accepted', status: 'approved' };
  }

  if (action === 'edited') {
    return { reviewStatus: 'edited', status: 'approved' };
  }

  return { reviewStatus: 'skipped', status: 'closed' };
};

export class ReviewOutreach {
  constructor(private readonly outreachRepository: OutreachRepository) {}

  async execute(input: ReviewOutreachInput): Promise<OutreachMessage | null> {
    const outreachId = assertNonEmpty(input.outreachId, 'Outreach id');
    const { reviewStatus, status } = resolveStatuses(input.action);

    if (input.action === 'edited') {
      const subject = assertNonEmpty(input.subject ?? '', 'Edited subject');
      const body = assertNonEmpty(input.body ?? '', 'Edited body');

      return this.outreachRepository.updateReview(outreachId, {
        reviewStatus,
        status,
        subject,
        body,
        reviewedAt: new Date(),
      });
    }

    return this.outreachRepository.updateReview(outreachId, {
      reviewStatus,
      status,
      subject: normalizeOptional(input.subject),
      body: normalizeOptional(input.body),
      reviewedAt: new Date(),
    });
  }
}
