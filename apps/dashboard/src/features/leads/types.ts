export type Lead = {
  id: string;
  companyName: string;
  website: string;
  niche: string;
  location?: string;
  country?: string;
  source?: string;
  status: string;
  completeness: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactInfo = {
  emails: string[];
  phones: string[];
  addresses: string[];
};

export type ContactEnrichmentItem = {
  type: 'email' | 'phone' | 'address';
  value: string;
  sourceKind: 'main_page' | 'official_site' | 'external_public';
  sourceUrl: string;
  confidence: 'high' | 'medium' | 'low';
};

export type ContactEnrichment = {
  emails: ContactEnrichmentItem[];
  phones: ContactEnrichmentItem[];
  addresses: ContactEnrichmentItem[];
};

export type Snapshot = {
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
  extractedAt: string;
};

export type SignalSet = {
  bookingPresence: string;
  contactClarity: string;
  trustSignalStrength: string;
  businessScale: string;
  localRelevance: string;
  outreachFit: string;
  fitReason: string;
  confidence: string;
  leadCompleteness: string;
  issuesDetected: string[];
  evidence: string[];
};

export type LeadSignalsResult = {
  lead: Lead;
  snapshotId: string;
  signals: SignalSet;
};
