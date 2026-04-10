import { apiRequest } from '../../lib/apiClient';
import type { OutreachLearningSummary } from './types';

export const fetchOutreachLearningSummary = (
  limit = 60,
): Promise<OutreachLearningSummary> =>
  apiRequest(`/feedback/outreach-learning?limit=${encodeURIComponent(String(limit))}`);
