import { printJson, withDb } from './_shared.mjs';

const collections = [
  { name: 'leads', latestSort: { updatedAt: -1, _id: -1 } },
  { name: 'leadsnapshots', latestSort: { extractedAt: -1, _id: -1 } },
  { name: 'audits', latestSort: { createdAt: -1, _id: -1 } },
  { name: 'outreachmessages', latestSort: { createdAt: -1, _id: -1 } },
];

await withDb(async ({ db }) => {
  const availableCollections = new Set((await db.listCollections().toArray()).map(({ name }) => name));
  const output = {};

  for (const { name, latestSort } of collections) {
    if (!availableCollections.has(name)) {
      output[name] = { exists: false };
      continue;
    }

    const collection = db.collection(name);
    const [count, latestDocument] = await Promise.all([
      collection.countDocuments(),
      collection.find({}).sort(latestSort).limit(1).next(),
    ]);

    output[name] = {
      exists: true,
      count,
      latestDocument,
    };
  }

  printJson(output);
});
