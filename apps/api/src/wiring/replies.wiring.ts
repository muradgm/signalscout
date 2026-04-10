import { CreateReply, GetRecentReplies, GetRepliesByLead } from '@signalscout/core';
import {
  MongoLeadSnapshotRepository,
  MongoLeadRepository,
  MongoOutreachRepository,
  MongoReplyRepository,
} from '@signalscout/db';

const replyRepository = new MongoReplyRepository();
const outreachRepository = new MongoOutreachRepository();
const leadRepository = new MongoLeadRepository();
const leadSnapshotRepository = new MongoLeadSnapshotRepository();

export const createReplyUseCase = new CreateReply(
  replyRepository,
  outreachRepository,
  leadRepository,
);
export const getRepliesByLeadUseCase = new GetRepliesByLead(replyRepository);
export const getRecentRepliesUseCase = new GetRecentReplies(replyRepository);
export { leadSnapshotRepository, outreachRepository, replyRepository };
