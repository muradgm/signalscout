import { parseArgs, parseLimit, printJson, withDb } from './_shared.mjs';

const { flags, positional } = parseArgs(process.argv.slice(2));
const limit =
  flags.limit === undefined && positional[0]
    ? parseLimit({ limit: positional[0] }, 20)
    : parseLimit(flags, 20);

await withDb(async ({ db }) => {
  const [recentEvents, typeBreakdown, providerBreakdown] = await Promise.all([
    db.collection('deliveryevents')
      .aggregate([
        { $sort: { occurredAt: -1, _id: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'leads',
            localField: 'leadId',
            foreignField: '_id',
            as: 'lead',
          },
        },
        {
          $project: {
            provider: 1,
            providerMessageId: 1,
            eventType: 1,
            occurredAt: 1,
            summary: 1,
            errorCode: 1,
            retryable: 1,
            lead: { $arrayElemAt: ['$lead', 0] },
          },
        },
      ])
      .toArray(),
    db.collection('deliveryevents')
      .aggregate([
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ])
      .toArray(),
    db.collection('deliveryevents')
      .aggregate([
        { $group: { _id: '$provider', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ])
      .toArray(),
  ]);

  printJson({
    scope: { limit },
    summary: {
      totalEvents: typeBreakdown.reduce((sum, item) => sum + item.count, 0),
      eventTypes: typeBreakdown.map((item) => ({
        eventType: item._id,
        count: item.count,
      })),
      providers: providerBreakdown.map((item) => ({
        provider: item._id,
        count: item.count,
      })),
    },
    recentEvents: recentEvents.map((event) => ({
      provider: event.provider,
      providerMessageId: event.providerMessageId,
      eventType: event.eventType,
      occurredAt: event.occurredAt,
      summary: event.summary,
      errorCode: event.errorCode,
      retryable: event.retryable,
      leadId: event.lead?._id?.toString?.() ?? null,
      companyName: event.lead?.companyName ?? null,
      location: event.lead?.location ?? null,
    })),
  });
});
