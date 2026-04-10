import type { Reply, ReplyChannel, ReplySource } from '../entities/Reply.js';

export interface SaveReplyInput {
  leadId: string;
  outreachId: string;
  channel: ReplyChannel;
  source: ReplySource;
  providerMessageId: string | null;
  inReplyToProviderMessageId: string | null;
  fromEmail: string;
  subject: string | null;
  body: string;
  receivedAt: Date;
}

export interface ReplyRepository {
  save(input: SaveReplyInput): Promise<Reply>;
  findByProviderMessageId(providerMessageId: string): Promise<Reply | null>;
  findLatestByLeadId(leadId: string): Promise<Reply | null>;
  findManyByLeadId(leadId: string, limit?: number): Promise<Reply[]>;
  findRecent(limit?: number): Promise<Reply[]>;
}
