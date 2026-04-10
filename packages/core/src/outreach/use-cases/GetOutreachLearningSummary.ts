import type { OutreachLearningSummary, OutreachRepository } from '../ports/OutreachRepository.js';

export class GetOutreachLearningSummary {
  constructor(private readonly outreachRepository: OutreachRepository) {}

  async execute(input?: { limit?: number }): Promise<OutreachLearningSummary> {
    const requestedLimit = input?.limit ?? 60;
    const limit = Number.isFinite(requestedLimit)
      ? Math.max(1, Math.min(200, Math.trunc(requestedLimit)))
      : 60;

    return this.outreachRepository.getLearningSummary(limit);
  }
}
