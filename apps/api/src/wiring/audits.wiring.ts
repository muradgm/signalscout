import { MockAuditGenerator, OpenAiAuditGenerator } from '@signalscout/ai';
import {
  DetectSignals,
  GenerateAudit,
  GetAuditByLead,
  GetLeadById,
  GetLatestLeadSnapshot,
} from '@signalscout/core';
import {
  MongoAuditRepository,
  MongoLeadRepository,
  MongoLeadSnapshotRepository,
} from '@signalscout/db';
import { RuleBasedSignalDetector } from '@signalscout/scraper';
import { env } from '../bootstrap/env.js';

const leadRepository = new MongoLeadRepository();
const leadSnapshotRepository = new MongoLeadSnapshotRepository();
const auditRepository = new MongoAuditRepository();

const signalDetector = new RuleBasedSignalDetector();

const auditGenerator = env.useMockAi
  ? new MockAuditGenerator()
  : new OpenAiAuditGenerator({
      apiKey: env.openAiApiKey,
    });

export const getLeadByIdForAuditUseCase = new GetLeadById(leadRepository);
export const getLatestLeadSnapshotForAuditUseCase = new GetLatestLeadSnapshot(
  leadSnapshotRepository,
);
export const detectSignalsForAuditUseCase = new DetectSignals(signalDetector);
export const generateAuditUseCase = new GenerateAudit(
  auditGenerator,
  auditRepository,
);
export const getAuditByLeadUseCase = new GetAuditByLead(auditRepository);