import type {
  LeadSnapshot,
  LeadSnapshotRepository,
  SaveLeadSnapshotInput,
} from '@signalscout/core';
import { Types } from 'mongoose';
import { mapLeadSnapshotDocumentToEntity } from '../mappers/snapshot.mapper.js';
import { LeadSnapshotModel } from '../models/LeadSnapshotModel.js';

export class MongoLeadSnapshotRepository implements LeadSnapshotRepository {
  async save(input: SaveLeadSnapshotInput): Promise<LeadSnapshot> {
    const document = await LeadSnapshotModel.create({
      leadId: new Types.ObjectId(input.leadId),
      url: input.snapshot.url,
      pageTitle: input.snapshot.pageTitle,
      metaDescription: input.snapshot.metaDescription,
      visibleText: input.snapshot.visibleText,
      contactInfo: input.snapshot.contactInfo,
      contactEnrichment: input.snapshot.contactEnrichment,
      bookingLinks: input.snapshot.bookingLinks,
      trustSignals: input.snapshot.trustSignals,
      isPlaceholderContent: input.snapshot.isPlaceholderContent,
      extractedAt: input.snapshot.extractedAt,
    });

    return mapLeadSnapshotDocumentToEntity(document);
  }

  async findLatestByLeadId(leadId: string): Promise<LeadSnapshot | null> {
    const document = await LeadSnapshotModel.findOne({
      leadId: new Types.ObjectId(leadId),
    })
      .sort({ extractedAt: -1, _id: -1 })
      .exec();

    if (!document) {
      return null;
    }

    return mapLeadSnapshotDocumentToEntity(document);
  }
}
