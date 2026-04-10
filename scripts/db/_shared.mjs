import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(repoRoot, '.env') });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('Missing required environment variable: MONGODB_URI');
}

export const withDb = async (run) => {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
  });

  try {
    return await run({
      db: mongoose.connection.db,
      connection: mongoose.connection,
      mongoose,
    });
  } finally {
    await mongoose.disconnect();
  }
};

export const parseArgs = (argv) => {
  const positional = [];
  const flags = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value.startsWith('--')) {
      positional.push(value);
      continue;
    }

    const [rawKey, inlineRawValue] = value.slice(2).split('=');
    const nextValue = argv[index + 1];
    const inlineValue = inlineRawValue ?? null;
    const hasSeparateValue = inlineValue === null && nextValue && !nextValue.startsWith('--');

    flags[rawKey] = inlineValue ?? (hasSeparateValue ? nextValue : true);

    if (hasSeparateValue) {
      index += 1;
    }
  }

  return { positional, flags };
};

export const requireLeadId = (flags) => {
  const leadId = flags.leadId ?? flags['lead-id'];

  if (typeof leadId !== 'string' || leadId.trim().length === 0) {
    throw new Error('Expected --leadId <mongodb-object-id>');
  }

  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new Error(`Invalid Mongo ObjectId: ${leadId}`);
  }

  return leadId.trim();
};

export const parseLimit = (flags, fallback = 5) => {
  const rawValue = flags.limit;

  if (rawValue === undefined) {
    return fallback;
  }

  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid --limit value: ${rawValue}`);
  }

  return parsed;
};

export const printJson = (value) => {
  console.log(JSON.stringify(value, null, 2));
};

export const printSection = (label, value) => {
  console.log(`\n## ${label}`);

  if (typeof value === 'string') {
    console.log(value);
    return;
  }

  console.log(inspect(value, {
    depth: null,
    colors: true,
    compact: false,
    sorted: true,
  }));
};
