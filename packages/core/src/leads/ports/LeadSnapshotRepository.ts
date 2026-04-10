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
  findById(snapshotId: string): Promise<LeadSnapshot | null>;
  findLatestByLeadId(leadId: string): Promise<LeadSnapshot | null>;
  findLeadIdsByEmail(email: string, limit?: number): Promise<string[]>;
}
