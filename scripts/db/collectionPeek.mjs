import { parseArgs, parseLimit, printJson, withDb } from './_shared.mjs';

const { flags } = parseArgs(process.argv.slice(2));
const collectionName = flags.collection ?? flags.name;
const limit = parseLimit(flags, 10);

if (typeof collectionName !== 'string' || collectionName.trim().length === 0) {
  throw new Error('Expected --collection <mongodb-collection-name>');
}

const parseJsonFlag = (value, label, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Expected --${label} to be a JSON object`);
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid --${label} JSON: ${message}`);
  }
};

const filter = parseJsonFlag(flags.filter, 'filter', {});
const projection = parseJsonFlag(flags.projection, 'projection', null);
const sort = parseJsonFlag(flags.sort, 'sort', { createdAt: -1, _id: -1 });

await withDb(async ({ db }) => {
  const availableCollections = new Set((await db.listCollections().toArray()).map(({ name }) => name));

  if (!availableCollections.has(collectionName)) {
    throw new Error(`Collection does not exist: ${collectionName}`);
  }

  const documents = await db
    .collection(collectionName)
    .find(filter, projection ? { projection } : undefined)
    .sort(sort)
    .limit(limit)
    .toArray();

  printJson({
    collection: collectionName,
    filter,
    projection,
    sort,
    limit,
    count: documents.length,
    documents,
  });
});
