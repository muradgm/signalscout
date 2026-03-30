import type {
  OutreachMessage,
  OutreachRepository,
  SaveOutreachInput,
} from '@signalscout/core';
import { Types } from 'mongoose';
import { mapOutreachMessageDocumentToEntity } from '../mappers/outreach.mapper.js';
import { OutreachMessageModel } from '../models/OutreachMessageModel.js';

export class MongoOutreachRepository implements OutreachRepository {
  async save(input: SaveOutreachInput): Promise<OutreachMessage> {
    const document = await OutreachMessageModel.create({
      leadId: new Types.ObjectId(input.leadId),
      auditId: new Types.ObjectId(input.auditId),
      channel: input.channel,
      recommendation: input.recommendation,
      fitReason: input.fitReason,
      bestAngle: input.bestAngle,
      subject: input.subject,
      body: input.body,
      reasoning: input.reasoning,
      evidence: input.evidence,
      status: input.status,
    });

    return mapOutreachMessageDocumentToEntity(document);
  }

  async findLatestByLeadId(leadId: string): Promise<OutreachMessage | null> {
    const document = await OutreachMessageModel.findOne({
      leadId: new Types.ObjectId(leadId),
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!document) {
      return null;
    }

    return mapOutreachMessageDocumentToEntity(document);
  }
}