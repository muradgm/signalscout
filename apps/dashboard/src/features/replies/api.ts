import { apiRequest } from '../../lib/apiClient';
import type { Reply } from './types';

export const fetchRepliesByLead = (leadId: string): Promise<Reply[]> =>
  apiRequest(`/replies/lead?leadId=${encodeURIComponent(leadId)}`);

export const fetchRecentReplies = (limit = 8): Promise<Reply[]> =>
  apiRequest(`/replies/recent?limit=${encodeURIComponent(String(limit))}`);

export const createReply = (
  outreachId: string,
  input: {
    fromEmail: string;
    subject: string | null;
    body: string;
    source?: 'manual' | 'provider_webhook';
    providerMessageId?: string | null;
    inReplyToProviderMessageId?: string | null;
    receivedAt?: string;
  },
): Promise<Reply> =>
  apiRequest(`/outreach/${outreachId}/replies`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
