import { ApiRequestError, apiRequest } from '../../lib/apiClient';
import type { Audit } from './types';

export const fetchLatestAudit = async (leadId: string): Promise<Audit | null> => {
  try {
    return await apiRequest(`/audits/lead?leadId=${encodeURIComponent(leadId)}`);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const generateAudit = (leadId: string): Promise<Audit> =>
  apiRequest(`/leads/${leadId}/audit`, { method: 'POST' });
