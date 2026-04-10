import mongoose from 'mongoose';
import { parseArgs, parseLimit, printJson, requireLeadId, withDb } from './_shared.mjs';

const { flags } = parseArgs(process.argv.slice(2));
const leadId = requireLeadId(flags);
const limit = parseLimit(flags, 3);

await withDb(async ({ db }) => {
  const objectId = new mongoose.Types.ObjectId(leadId);
  const leads = db.collection('leads');
  const snapshots = db.collection('leadsnapshots');
  const audits = db.collection('audits');
  const outreach = db.collection('outreachmessages');

  const lead = await leads.findOne({ _id: objectId });
  const latestSnapshots = await snapshots
    .find({ leadId: objectId })
    .sort({ extractedAt: -1, _id: -1 })
    .limit(limit)
    .toArray();
  const latestAudits = await audits
    .find({ leadId: objectId })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();
  const latestOutreach = await outreach
    .find({ leadId: objectId })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();

  const latestSnapshotId = latestSnapshots[0]?._id ?? null;
  const auditsForLatestSnapshot = latestSnapshotId
    ? await audits
        .find({ leadId: objectId, snapshotId: latestSnapshotId })
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
        .toArray()
    : [];

  printJson({
    leadId,
    lead,
    latestSnapshots,
    latestAudits,
    auditsForLatestSnapshot,
    latestOutreach,
  });
});
