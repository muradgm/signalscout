import type { Audit, AuditRepository, SaveAuditInput } from '@signalscout/core';
import { Types } from 'mongoose';
import { mapAuditDocumentToEntity } from '../mappers/audit.mapper.js';
import { AuditModel } from '../models/AuditModel.js';

export class MongoAuditRepository implements AuditRepository {
  async save(input: SaveAuditInput): Promise<Audit> {
    const document = await AuditModel.create({
      leadId: new Types.ObjectId(input.leadId),
      snapshotId: new Types.ObjectId(input.snapshotId),
      summary: input.summary,
      strengths: input.strengths,
      opportunities: input.opportunities,
      opportunityDetails: input.opportunityDetails,
      risks: input.risks,
      recommendedAngle: input.recommendedAngle,
      confidenceNote: input.confidenceNote,
      evidence: input.evidence,
    });

    return mapAuditDocumentToEntity(document);
  }

  async findLatestByLeadId(leadId: string): Promise<Audit | null> {
    const document = await AuditModel.findOne({
      leadId: new Types.ObjectId(leadId),
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!document) {
      return null;
    }

    return mapAuditDocumentToEntity(document);
  }
}