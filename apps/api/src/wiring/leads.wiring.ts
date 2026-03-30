import {
  CreateLead,
  DetectSignals,
  GetLeadById,
  GetLatestLeadSnapshot,
  ListLeads,
  RefreshLeadSnapshot,
} from '@signalscout/core';
import {
  MongoLeadRepository,
  MongoLeadSnapshotRepository,
} from '@signalscout/db';
import {
  RuleBasedSignalDetector,
  WebsiteLeadSnapshotExtractor,
} from '@signalscout/scraper';

const leadRepository = new MongoLeadRepository();
const leadSnapshotRepository = new MongoLeadSnapshotRepository();
const leadSnapshotExtractor = new WebsiteLeadSnapshotExtractor();
const signalDetector = new RuleBasedSignalDetector();

export const createLeadUseCase = new CreateLead(leadRepository);
export const listLeadsUseCase = new ListLeads(leadRepository);
export const getLeadByIdUseCase = new GetLeadById(leadRepository);
export const getLatestLeadSnapshotUseCase = new GetLatestLeadSnapshot(
  leadSnapshotRepository,
);
export const refreshLeadSnapshotUseCase = new RefreshLeadSnapshot(
  leadRepository,
  leadSnapshotRepository,
  leadSnapshotExtractor,
);
export const detectSignalsUseCase = new DetectSignals(signalDetector);