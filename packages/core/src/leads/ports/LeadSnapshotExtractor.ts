import type { ContactInfo } from '../entities/LeadSnapshot.js';

export interface ExtractedLeadSnapshotData {
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  visibleText: string;
  contactInfo: ContactInfo;
  bookingLinks: string[];
  trustSignals: string[];
  extractedAt: Date;
  isPlaceholderContent: boolean;
}

export interface LeadSnapshotExtractor {
  extract(url: string): Promise<ExtractedLeadSnapshotData>;
}