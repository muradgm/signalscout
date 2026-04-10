import { GetOutreachLearningSummary } from '@signalscout/core';
import { MongoOutreachRepository } from '@signalscout/db';

export const createGetOutreachLearningSummary = (): GetOutreachLearningSummary =>
  new GetOutreachLearningSummary(new MongoOutreachRepository());
