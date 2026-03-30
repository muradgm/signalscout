import type { LeadCompleteness } from '../../leads/entities/Lead.js';

export type BookingPresence = 'direct' | 'indirect' | 'not_detected';

export type ContactClarity = 'low' | 'medium' | 'high';

export type TrustSignalStrength = 'low' | 'medium' | 'high';

export type BusinessScale = 'single_location' | 'multi_location' | 'large_chain';

export type LocalRelevance = 'high_match' | 'partial_match' | 'low_match';

export type OutreachFit = 'good' | 'uncertain' | 'poor';

export type SignalConfidence = 'low' | 'medium' | 'high';

export interface SignalSet {
  bookingPresence: BookingPresence;
  contactClarity: ContactClarity;
  trustSignalStrength: TrustSignalStrength;
  businessScale: BusinessScale;
  localRelevance: LocalRelevance;
  outreachFit: OutreachFit;
  fitReason: string;
  confidence: SignalConfidence;
  leadCompleteness: LeadCompleteness;
  issuesDetected: string[];
  evidence: string[];
}