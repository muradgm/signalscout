import type { Reply } from '@signalscout/core';

export const mapReplyToResponse = (reply: Reply) => ({
  id: reply.id,
  leadId: reply.leadId,
  outreachId: reply.outreachId,
  channel: reply.channel,
  source: reply.source,
  providerMessageId: reply.providerMessageId,
  inReplyToProviderMessageId: reply.inReplyToProviderMessageId,
  fromEmail: reply.fromEmail,
  subject: reply.subject,
  body: reply.body,
  receivedAt: reply.receivedAt.toISOString(),
  createdAt: reply.createdAt.toISOString(),
});
