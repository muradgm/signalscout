import {
  MockOutreachGenerator,
  OpenAiOutreachGenerator,
  OutreachPolishingLayer,
} from '@signalscout/ai';
import {
  DetectSignals,
  GenerateOutreach,
  GetAuditById,
  GetDeliveryTelemetryByOutreach,
  GetAuditByLeadAndSnapshot,
  GetLeadById,
  GetLeadSnapshotById,
  GetLatestLeadSnapshot,
  GetOutreachByLead,
  ReviewOutreach,
  SendOutreach,
} from '@signalscout/core';
import {
  MongoAuditRepository,
  MongoDeliveryEventRepository,
  MongoLeadRepository,
  MongoLeadSnapshotRepository,
  MongoOutreachRepository,
} from '@signalscout/db';
import { RuleBasedSignalDetector } from '@signalscout/scraper';
import { env } from '../bootstrap/env.js';
import { ResendOutreachSender } from '../adapters/ResendOutreachSender.js';

const leadRepository = new MongoLeadRepository();
const leadSnapshotRepository = new MongoLeadSnapshotRepository();
const auditRepository = new MongoAuditRepository();
const outreachRepository = new MongoOutreachRepository();
const deliveryEventRepository = new MongoDeliveryEventRepository();

const signalDetector = new RuleBasedSignalDetector();
const outreachGenerator = new OutreachPolishingLayer(
  env.useMockAi
    ? new MockOutreachGenerator()
    : new OpenAiOutreachGenerator({
        apiKey: env.openAiApiKey,
      }),
);
const outreachSender = new ResendOutreachSender(
  env.resendApiKey,
  env.resendFromEmail,
  env.resendFromName,
  env.resendReplyToEmail,
);

export const getLeadByIdForOutreachUseCase = new GetLeadById(leadRepository);
export const getLeadSnapshotByIdForOutreachUseCase = new GetLeadSnapshotById(
  leadSnapshotRepository,
);
export const getLatestLeadSnapshotForOutreachUseCase = new GetLatestLeadSnapshot(
  leadSnapshotRepository,
);
export const detectSignalsForOutreachUseCase = new DetectSignals(signalDetector);
export const getAuditByLeadAndSnapshotForOutreachUseCase =
  new GetAuditByLeadAndSnapshot(auditRepository);
export const getAuditByIdForOutreachUseCase = new GetAuditById(auditRepository);
export const generateOutreachUseCase = new GenerateOutreach(
  outreachGenerator,
  outreachRepository,
);
export const getOutreachByLeadUseCase = new GetOutreachByLead(outreachRepository);
export const getDeliveryTelemetryByOutreachUseCase = new GetDeliveryTelemetryByOutreach(
  deliveryEventRepository,
);
export const reviewOutreachUseCase = new ReviewOutreach(outreachRepository);
export const sendOutreachUseCase = new SendOutreach(
  outreachRepository,
  leadSnapshotRepository,
  outreachSender,
  deliveryEventRepository,
);
export { deliveryEventRepository, outreachRepository };
