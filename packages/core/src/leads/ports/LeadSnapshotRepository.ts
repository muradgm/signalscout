import type {
  ExtractedLeadSnapshotData,
  LeadSnapshot,
} from '../entities/LeadSnapshot.js';

export interface SaveLeadSnapshotInput {
  leadId: string;
  snapshot: ExtractedLeadSnapshotData;
}

export interface LeadSnapshotRepository {
  save(input: SaveLeadSnapshotInput): Promise<LeadSnapshot>;
  findLatestByLeadId(leadId: string): Promise<LeadSnapshot | null>;
}