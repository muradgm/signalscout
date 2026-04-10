import type { Reply, ReplyRepository, SaveReplyInput } from '@signalscout/core';
import { Types } from 'mongoose';
import { mapReplyDocumentToEntity } from '../mappers/reply.mapper.js';
import { ReplyModel } from '../models/ReplyModel.js';

export class MongoReplyRepository implements ReplyRepository {
  async save(input: SaveReplyInput): Promise<Reply> {
    const document = await ReplyModel.create({
      leadId: new Types.ObjectId(input.leadId),
      outreachId: new Types.ObjectId(input.outreachId),
      channel: input.channel,
      source: input.source,
      providerMessageId: input.providerMessageId,
      inReplyToProviderMessageId: input.inReplyToProviderMessageId,
      fromEmail: input.fromEmail,
      subject: input.subject,
      body: input.body,
      receivedAt: input.receivedAt,
    });

    return mapReplyDocumentToEntity(document);
  }

  async findByProviderMessageId(providerMessageId: string): Promise<Reply | null> {
    const document = await ReplyModel.findOne({
      providerMessageId: providerMessageId.trim(),
    }).exec();

    return document ? mapReplyDocumentToEntity(document) : null;
  }

  async findLatestByLeadId(leadId: string): Promise<Reply | null> {
    const document = await ReplyModel.findOne({
      leadId: new Types.ObjectId(leadId),
    })
      .sort({ receivedAt: -1, _id: -1 })
      .exec();

    return document ? mapReplyDocumentToEntity(document) : null;
  }

  async findManyByLeadId(leadId: string, limit = 10): Promise<Reply[]> {
    const documents = await ReplyModel.find({
      leadId: new Types.ObjectId(leadId),
    })
      .sort({ receivedAt: -1, _id: -1 })
      .limit(limit)
      .exec();

    return documents.map(mapReplyDocumentToEntity);
  }

  async findRecent(limit = 10): Promise<Reply[]> {
    const documents = await ReplyModel.find({})
      .sort({ receivedAt: -1, _id: -1 })
      .limit(limit)
      .exec();

    return documents.map(mapReplyDocumentToEntity);
  }
}
