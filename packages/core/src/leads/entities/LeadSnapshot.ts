export interface ContactInfo {
  emails: string[];
  phones: string[];
  addresses: string[];
}

export type ContactValueType = 'email' | 'phone' | 'address';
export type ContactSourceKind = 'main_page' | 'official_site' | 'external_public';
export type ContactConfidence = 'high' | 'medium' | 'low';

export interface ContactValueWithSource {
  type: ContactValueType;
  value: string;
  sourceKind: ContactSourceKind;
  sourceUrl: string;
  confidence: ContactConfidence;
}

export interface ContactEnrichment {
  emails: ContactValueWithSource[];
  phones: ContactValueWithSource[];
  addresses: ContactValueWithSource[];
}

export interface LeadSnapshot {
  id: string;
  leadId: string;

  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  visibleText: string;

  contactInfo: ContactInfo;
  contactEnrichment: ContactEnrichment;
  bookingLinks: string[];
  trustSignals: string[];

  isPlaceholderContent: boolean;

  extractedAt: Date;
}

export interface ExtractedLeadSnapshotData {
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  visibleText: string;

  contactInfo: ContactInfo;
  contactEnrichment: ContactEnrichment;
  bookingLinks: string[];
  trustSignals: string[];

  isPlaceholderContent: boolean;

  extractedAt: Date;
}
