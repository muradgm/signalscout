import type { Reply } from '../entities/Reply.js';
import type { ReplyRepository } from '../ports/ReplyRepository.js';

export class GetRepliesByLead {
  constructor(private readonly replyRepository: ReplyRepository) {}

  async execute(leadId: string): Promise<Reply[]> {
    return this.replyRepository.findManyByLeadId(leadId, 10);
  }
}
