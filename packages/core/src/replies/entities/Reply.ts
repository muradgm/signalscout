export type ReplyChannel = 'email';
export type ReplySource = 'manual' | 'provider_webhook';

export interface Reply {
  id: string;
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
  createdAt: Date;
}
