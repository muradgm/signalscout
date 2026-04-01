import { createDefaultOutreachGenerator } from '@signalscout/ai';
import {
  DetectSignals,
  GenerateOutreach,
  GetAuditByLeadAndSnapshot,
  GetLeadById,
  GetLatestLeadSnapshot,
  GetOutreachByLead,
} from '@signalscout/core';
import {
  MongoAuditRepository,
  MongoLeadRepository,
  MongoLeadSnapshotRepository,
  MongoOutreachRepository,
} from '@signalscout/db';
import { RuleBasedSignalDetector } from '@signalscout/scraper';

const leadRepository = new MongoLeadRepository();
const leadSnapshotRepository = new MongoLeadSnapshotRepository();
const auditRepository = new MongoAuditRepository();
const outreachRepository = new MongoOutreachRepository();

const signalDetector = new RuleBasedSignalDetector();
const outreachGenerator = createDefaultOutreachGenerator();

export const getLeadByIdForOutreachUseCase = new GetLeadById(leadRepository);
export const getLatestLeadSnapshotForOutreachUseCase = new GetLatestLeadSnapshot(
  leadSnapshotRepository,
);
export const detectSignalsForOutreachUseCase = new DetectSignals(signalDetector);
export const getAuditByLeadAndSnapshotForOutreachUseCase =
  new GetAuditByLeadAndSnapshot(auditRepository);
export const generateOutreachUseCase = new GenerateOutreach(
  outreachGenerator,
  outreachRepository,
);
export const getOutreachByLeadUseCase = new GetOutreachByLead(outreachRepository);
