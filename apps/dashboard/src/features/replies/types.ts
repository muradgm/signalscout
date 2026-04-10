export type Reply = {
  id: string;
  leadId: string;
  outreachId: string;
  channel: 'email';
  source: 'manual' | 'provider_webhook';
  providerMessageId: string | null;
  inReplyToProviderMessageId: string | null;
  fromEmail: string;
  subject: string | null;
  body: string;
  receivedAt: string;
  createdAt: string;
};
