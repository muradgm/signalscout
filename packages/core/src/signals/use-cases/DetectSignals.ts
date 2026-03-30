import type { Lead, LeadSnapshot } from '../../leads/index.js';
import type { SignalSet } from '../entities/SignalSet.js';
import type { SignalDetector } from '../ports/SignalDetector.js';

export class DetectSignals {
  constructor(private readonly signalDetector: SignalDetector) {}

  async execute(lead: Lead, snapshot: LeadSnapshot): Promise<SignalSet> {
    return this.signalDetector.detect(lead, snapshot);
  }
}