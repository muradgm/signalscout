import { env } from '../../apps/api/dist/bootstrap/env.js';
import { connectDb, db } from '../../packages/db/dist/index.js';
import {
  OutreachMessageModel,
  ReplyModel,
  LeadModel,
  DeliveryEventModel,
} from '../../packages/db/dist/index.js';

const outreachId = '69cf8e09d2c9269b66d22cbf';
const leadId = '69cf8e09d2c9269b66d22ca9';

const main = async () => {
  await connectDb(env.mongoUri);

  const outreach = await OutreachMessageModel.findById(outreachId).lean().exec();
  const lead = await LeadModel.findById(leadId).lean().exec();
  const replies = await ReplyModel.find({ outreachId }).sort({ receivedAt: -1, _id: -1 }).lean().exec();
  const events = await DeliveryEventModel.find({ outreachId }).sort({ occurredAt: -1, _id: -1 }).lean().exec();

  console.log(
    JSON.stringify(
      {
        outreach: outreach
          ? {
              id: String(outreach._id),
              status: outreach.status,
              reviewStatus: outreach.reviewStatus,
              sentAt: outreach.sentAt,
              providerMessageId: outreach.providerMessageId,
              sendAttemptCount: outreach.sendAttemptCount,
              lastSendErrorCode: outreach.lastSendErrorCode,
              lastSendError: outreach.lastSendError,
            }
          : null,
        lead: lead
          ? {
              id: String(lead._id),
              status: lead.status,
            }
          : null,
        replies: replies.map((reply) => ({
          id: String(reply._id),
          fromEmail: reply.fromEmail,
          subject: reply.subject,
          body: reply.body,
          source: reply.source,
          providerMessageId: reply.providerMessageId,
          inReplyToProviderMessageId: reply.inReplyToProviderMessageId,
          receivedAt: reply.receivedAt,
        })),
        deliveryEvents: events.map((event) => ({
          id: String(event._id),
          eventType: event.eventType,
          providerMessageId: event.providerMessageId,
          summary: event.summary,
          occurredAt: event.occurredAt,
        })),
      },
      null,
      2,
    ),
  );

  await db.disconnect();
};

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
