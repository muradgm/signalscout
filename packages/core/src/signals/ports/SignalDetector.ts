import type { Lead, LeadSnapshot } from '../../leads/index.js';
import type { SignalSet } from '../entities/SignalSet.js';

export interface SignalDetector {
  detect(lead: Lead, snapshot: LeadSnapshot): Promise<SignalSet>;
}