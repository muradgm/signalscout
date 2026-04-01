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

export const generateOutreach = (leadId: string): Promise<Outreach> =>
  apiRequest(`/leads/${leadId}/outreach`, { method: 'POST' });
