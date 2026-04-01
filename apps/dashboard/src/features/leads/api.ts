import { apiRequest } from '../../lib/apiClient';
import type { Lead, LeadSignalsResult, Snapshot } from './types';

export const fetchLeads = (): Promise<Lead[]> => apiRequest('/leads');

export const fetchLeadSignals = (leadId: string): Promise<LeadSignalsResult> =>
  apiRequest(`/leads/${leadId}/signals`);

export const refreshLeadSnapshot = (leadId: string): Promise<Snapshot> =>
  apiRequest(`/leads/${leadId}/snapshot`, { method: 'POST' });
