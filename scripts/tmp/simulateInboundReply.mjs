import { env } from '../../apps/api/dist/bootstrap/env.js';
import { connectDb, db } from '../../packages/db/dist/index.js';
import { CreateReply } from '../../packages/core/dist/index.js';
import {
  MongoLeadRepository,
  MongoOutreachRepository,
  MongoReplyRepository,
} from '../../packages/db/dist/index.js';

const outreachId = '69cf8e09d2c9269b66d22cbf';
const inboundReply = {
  fromEmail: 'muradgm@gmail.com',
  subject: 'Re: Quick idea for making new-patient booking clearer at Isarbogen Zahnzentrum',
  body: 'Klingt interessant. Schicken Sie mir bitte die Kurzfassung.',
  source: 'provider_webhook',
  providerMessageId: `reply-${Date.now()}`,
  inReplyToProviderMessageId: '05a0c1f5-3504-4ba4-8cef-249484315db2',
  receivedAt: new Date(),
};

const main = async () => {
  await connectDb(env.mongoUri);

  const createReply = new CreateReply(
    new MongoReplyRepository(),
    new MongoOutreachRepository(),
    new MongoLeadRepository(),
  );

  const reply = await createReply.execute({
    outreachId,
    fromEmail: inboundReply.fromEmail,
    subject: inboundReply.subject,
    body: inboundReply.body,
    source: inboundReply.source,
    providerMessageId: inboundReply.providerMessageId,
    inReplyToProviderMessageId: inboundReply.inReplyToProviderMessageId,
    receivedAt: inboundReply.receivedAt,
  });

  console.log(
    JSON.stringify(
      {
        reply: reply
          ? {
              id: reply.id,
              leadId: reply.leadId,
              outreachId: reply.outreachId,
              fromEmail: reply.fromEmail,
              subject: reply.subject,
              body: reply.body,
              source: reply.source,
              providerMessageId: reply.providerMessageId,
              inReplyToProviderMessageId: reply.inReplyToProviderMessageId,
              receivedAt: reply.receivedAt,
            }
          : null,
      },
      null,
      2,
    ),
  );

  await db.disconnect();
};

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
