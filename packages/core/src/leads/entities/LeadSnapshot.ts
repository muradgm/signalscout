export interface ContactInfo {
  emails: string[];
  phones: string[];
  addresses: string[];
}

export interface LeadSnapshot {
  id: string;
  leadId: string;

  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  visibleText: string;

  contactInfo: ContactInfo;
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
  bookingLinks: string[];
  trustSignals: string[];

  isPlaceholderContent: boolean;

  extractedAt: Date;
}