import type {
  DeliveryEvent,
  DeliveryEventRepository,
  DeliveryEventSummary,
  SaveDeliveryEventInput,
} from '@signalscout/core';
import { Types } from 'mongoose';
import { mapDeliveryEventDocumentToEntity } from '../mappers/deliveryEvent.mapper.js';
import { DeliveryEventModel } from '../models/DeliveryEventModel.js';
import { OutreachMessageModel } from '../models/OutreachMessageModel.js';

const EMPTY_SUMMARY: DeliveryEventSummary = {
  totalEvents: 0,
  latestEventType: null,
  latestEventAt: null,
  deliveredCount: 0,
  openedCount: 0,
  clickedCount: 0,
  bouncedCount: 0,
  complainedCount: 0,
  failedCount: 0,
};

export class MongoDeliveryEventRepository implements DeliveryEventRepository {
  async save(input: SaveDeliveryEventInput): Promise<DeliveryEvent> {
    const outreachId = new Types.ObjectId(input.outreachId);
    const leadId = new Types.ObjectId(input.leadId);
    const filter = {
      outreachId,
      leadId,
      provider: input.provider,
      providerMessageId: input.providerMessageId,
      eventType: input.eventType,
      occurredAt: input.occurredAt,
      summary: input.summary,
      errorCode: input.errorCode,
    };
    const document = await DeliveryEventModel.findOneAndUpdate(
      filter,
      {
        $setOnInsert: {
          ...filter,
          retryable: input.retryable,
        },
      },
      {
        upsert: true,
        new: true,
      },
    ).exec();

    return mapDeliveryEventDocumentToEntity(document);
  }

  async findLatestByOutreachId(outreachId: string, limit = 5): Promise<DeliveryEvent[]> {
    const documents = await DeliveryEventModel.find({
      outreachId: new Types.ObjectId(outreachId),
    })
      .sort({ occurredAt: -1, _id: -1 })
      .limit(limit)
      .exec();

    return documents.map(mapDeliveryEventDocumentToEntity);
  }

  async summarizeByOutreachId(outreachId: string): Promise<DeliveryEventSummary> {
    const objectId = new Types.ObjectId(outreachId);
    const [latestDocument, counts] = await Promise.all([
      DeliveryEventModel.findOne({ outreachId: objectId })
        .sort({ occurredAt: -1, _id: -1 })
        .exec(),
      DeliveryEventModel.aggregate([
        { $match: { outreachId: objectId } },
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
      ]),
    ]);

    if (!latestDocument) {
      return EMPTY_SUMMARY;
    }

    const summary = { ...EMPTY_SUMMARY };

    for (const row of counts) {
      summary.totalEvents += row.count;

      if (row._id === 'delivered') summary.deliveredCount = row.count;
      if (row._id === 'opened') summary.openedCount = row.count;
      if (row._id === 'clicked') summary.clickedCount = row.count;
      if (row._id === 'bounced') summary.bouncedCount = row.count;
      if (row._id === 'complained') summary.complainedCount = row.count;
      if (row._id === 'failed') summary.failedCount = row.count;
    }

    summary.latestEventType = latestDocument.eventType;
    summary.latestEventAt = latestDocument.occurredAt;

    return summary;
  }

  async findOutreachIdByProviderMessageId(
    provider: 'resend',
    providerMessageId: string,
  ): Promise<string | null> {
    const outreach = await OutreachMessageModel.findOne({
      deliveryProvider: provider,
      providerMessageId,
    })
      .select({ _id: 1 })
      .exec();

    return outreach?._id?.toString() ?? null;
  }
}
