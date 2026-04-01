import type { Lead } from '../entities/Lead.js';
import type { ContactInfo } from '../entities/LeadSnapshot.js';
import type { ContactEnrichment } from '../entities/LeadSnapshot.js';

export interface ExtractedLeadSnapshotData {
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  visibleText: string;
  contactInfo: ContactInfo;
  contactEnrichment: ContactEnrichment;
  bookingLinks: string[];
  trustSignals: string[];
  extractedAt: Date;
  isPlaceholderContent: boolean;
}

export interface LeadSnapshotExtractor {
  extract(lead: Lead): Promise<ExtractedLeadSnapshotData>;
}
