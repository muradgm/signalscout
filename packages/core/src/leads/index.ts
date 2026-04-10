export * from './entities/Lead.js';

export * from './ports/LeadDiscoverySource.js';
export * from './ports/LeadRepository.js';
export * from './ports/LeadSnapshotExtractor.js';
export * from './ports/LeadSnapshotRepository.js';

export * from './use-cases/CreateLead.js';
export * from './use-cases/GetLeadById.js';
export * from './use-cases/GetLeadSnapshotById.js';
export * from './use-cases/GetLatestLeadSnapshot.js';
export * from './use-cases/ListLeads.js';
export * from './use-cases/RefreshLeadSnapshot.js';

export * from './entities/LeadSnapshot.js';   // keep this
export type { ExtractedLeadSnapshotData } from './entities/LeadSnapshot.js'; // this resolves the ambiguity
