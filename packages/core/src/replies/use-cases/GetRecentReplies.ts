import type { Reply } from '../entities/Reply.js';
import type { ReplyRepository } from '../ports/ReplyRepository.js';

export class GetRecentReplies {
  constructor(private readonly replyRepository: ReplyRepository) {}

  async execute(limit = 10): Promise<Reply[]> {
    return this.replyRepository.findRecent(limit);
  }
}
