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

  async findById(snapshotId: string): Promise<LeadSnapshot | null> {
    const document = await LeadSnapshotModel.findById(
      new Types.ObjectId(snapshotId),
    ).exec();

    if (!document) {
      return null;
    }

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

  async findLeadIdsByEmail(email: string, limit = 10): Promise<string[]> {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return [];
    }

    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactEmailPattern = new RegExp(`^${escapedEmail}$`, 'i');
    const documents = await LeadSnapshotModel.find({
      $or: [
        { 'contactInfo.emails': exactEmailPattern },
        { 'contactEnrichment.emails.value': exactEmailPattern },
      ],
    })
      .sort({ extractedAt: -1, _id: -1 })
      .limit(Math.max(limit * 3, limit))
      .select({ leadId: 1 })
      .lean()
      .exec();

    const uniqueLeadIds = new Set<string>();

    for (const document of documents) {
      const leadId = document.leadId?.toString();

      if (!leadId || uniqueLeadIds.has(leadId)) {
        continue;
      }

      uniqueLeadIds.add(leadId);

      if (uniqueLeadIds.size >= limit) {
        break;
      }
    }

    return [...uniqueLeadIds];
  }
}
