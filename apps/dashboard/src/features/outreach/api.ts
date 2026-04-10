import { ApiRequestError, apiRequest } from '../../lib/apiClient';
import type { Outreach } from './types';

export const fetchLatestOutreach = async (
  leadId: string,
): Promise<Outreach | null> => {
  try {
    return await apiRequest(`/outreach/lead?leadId=${encodeURIComponent(leadId)}`);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const generateOutreach = (
  leadId: string,
  auditId?: string,
): Promise<Outreach> =>
  apiRequest(`/leads/${leadId}/outreach`, {
    method: 'POST',
    body: JSON.stringify(auditId ? { auditId } : {}),
  });

export const reviewOutreach = (
  outreachId: string,
  input:
    | { action: 'accepted'; subject: string | null; body: string | null }
    | { action: 'edited'; subject: string; body: string }
    | { action: 'skipped'; subject: string | null; body: string | null },
): Promise<Outreach> =>
  apiRequest(`/outreach/${outreachId}/review`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });

export const sendOutreach = (outreachId: string): Promise<Outreach> =>
  apiRequest(`/outreach/${outreachId}/send`, {
    method: 'POST',
  });
