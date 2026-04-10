import { printJson, withDb } from './_shared.mjs';

const expectedIndexes = {
  leadsnapshots: [
    { leadId: 1, extractedAt: -1, _id: -1 },
  ],
  audits: [
    { leadId: 1, createdAt: -1, _id: -1 },
    { leadId: 1, snapshotId: 1, createdAt: -1, _id: -1 },
    { snapshotId: 1, createdAt: -1, _id: -1 },
  ],
  outreachmessages: [
    { leadId: 1, createdAt: -1, _id: -1 },
    { auditId: 1, createdAt: -1, _id: -1 },
  ],
};

const matchesKey = (actual, expected) => {
  const actualEntries = Object.entries(actual);
  const expectedEntries = Object.entries(expected);

  return (
    actualEntries.length === expectedEntries.length &&
    expectedEntries.every(([field, direction], index) => {
      const [actualField, actualDirection] = actualEntries[index] ?? [];
      return actualField === field && actualDirection === direction;
    })
  );
};

await withDb(async ({ db }) => {
  const output = {};

  for (const [collectionName, expected] of Object.entries(expectedIndexes)) {
    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();

    if (!collectionExists) {
      output[collectionName] = {
        exists: false,
        indexes: [],
        missingExpectedIndexes: expected,
      };
      continue;
    }

    const indexes = await db.collection(collectionName).indexes();
    const keys = indexes.map((index) => index.key);
    const missingExpectedIndexes = expected.filter(
      (expectedKey) => !keys.some((actualKey) => matchesKey(actualKey, expectedKey)),
    );

    output[collectionName] = {
      exists: true,
      indexes: indexes.map((index) => ({
        name: index.name,
        key: index.key,
        unique: index.unique ?? false,
        sparse: index.sparse ?? false,
      })),
      missingExpectedIndexes,
    };
  }

  printJson(output);
});
