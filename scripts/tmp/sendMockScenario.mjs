import { env } from '../../apps/api/dist/bootstrap/env.js';
import { ResendOutreachSender } from '../../apps/api/dist/adapters/ResendOutreachSender.js';
import {
  createDefaultOutreachGenerator,
  MockAuditGenerator,
} from '../../packages/ai/dist/index.js';
import {
  DetectSignals,
  GenerateAudit,
  GenerateOutreach,
  ReviewOutreach,
  SendOutreach,
} from '../../packages/core/dist/index.js';
import {
  connectDb,
  db,
  MongoAuditRepository,
  MongoDeliveryEventRepository,
  MongoLeadRepository,
  MongoLeadSnapshotRepository,
  MongoOutreachRepository,
} from '../../packages/db/dist/index.js';
import { RuleBasedSignalDetector } from '../../packages/scraper/dist/index.js';

const main = async () => {
  await connectDb(env.mongoUri);

  const leadRepository = new MongoLeadRepository();
  const snapshotRepository = new MongoLeadSnapshotRepository();
  const auditRepository = new MongoAuditRepository();
  const outreachRepository = new MongoOutreachRepository();
  const deliveryEventRepository = new MongoDeliveryEventRepository();

  const detectSignals = new DetectSignals(new RuleBasedSignalDetector());
  const generateAudit = new GenerateAudit(new MockAuditGenerator(), auditRepository);
  const generateOutreach = new GenerateOutreach(
    createDefaultOutreachGenerator(),
    outreachRepository,
  );
  const reviewOutreach = new ReviewOutreach(outreachRepository);
  const sendOutreach = new SendOutreach(
    outreachRepository,
    snapshotRepository,
    new ResendOutreachSender(
      env.resendApiKey,
      env.resendFromEmail,
      env.resendFromName,
    ),
    deliveryEventRepository,
  );

  const stamp = Date.now();
  const website = `https://isarbogen-zahnzentrum-${stamp}.example/`;

  const lead = await leadRepository.create({
    companyName: 'Isarbogen Zahnzentrum',
    website,
    niche: 'dentist',
    location: 'Munich',
    country: 'Germany',
    source: 'manual',
  });

  const snapshot = await snapshotRepository.save({
    leadId: lead.id,
    snapshot: {
      url: website,
      pageTitle: 'Isarbogen Zahnzentrum | Zahnarztpraxis in Muenchen Haidhausen',
      metaDescription:
        'Moderne Zahnarztpraxis in Muenchen Haidhausen mit Online-Termin, Implantologie, Kinderzahnheilkunde und klaren Kontaktwegen.',
      visibleText:
        'Isarbogen Zahnzentrum in Muenchen Haidhausen. Moderne Zahnmedizin fuer Familien, Berufstaetige und Angstpatienten. Online-Termin buchen, Implantologie, Kinderzahnheilkunde, Prophylaxe und ruhige Begleitung bei anspruchsvollen Behandlungen. Unser Team zeigt echte Behandlungsbereiche, klare Kontaktwege und eine direkte Terminoption fuer neue Patienten.',
      contactInfo: {
        emails: ['muradgm@gmail.com'],
        phones: ['089 4521 8800'],
        addresses: ['Einsteinstrasse 12 81675 Muenchen Haidhausen'],
      },
      contactEnrichment: {
        emails: [],
        phones: [],
        addresses: [],
      },
      bookingLinks: ['https://isarbogen-zahnzentrum-booking.example/request-appointment'],
      trustSignals: [
        'mentions team',
        'mentions patient comfort',
        'mentions advanced technology',
        'mentions family care',
      ],
      isPlaceholderContent: false,
      extractedAt: new Date(),
    },
  });

  const signals = await detectSignals.execute(lead, snapshot);
  const audit = await generateAudit.execute({ lead, snapshot, signals });
  const outreach = await generateOutreach.execute({
    lead,
    snapshot,
    signals,
    audit,
  });
  const fallbackSubject =
    outreach.subject?.trim() ||
    'Quick idea for making new-patient booking clearer at Isarbogen Zahnzentrum';
  const fallbackBody =
    outreach.body?.trim() ||
    [
      'Hi Isarbogen Zahnzentrum team,',
      '',
      'I took a look at your site and the clinic already gives a strong first impression, especially around family care, comfort, and visible treatment breadth.',
      '',
      'The main opportunity I noticed is that the booking path could work a little harder to turn that trust into a more immediate next step for new patients.',
      '',
      'I put together a few concrete suggestions on how to tighten that journey without changing the overall feel of the site.',
      '',
      'If useful, I can send over a short version.',
      '',
      'Best,',
      'Murad',
    ].join('\\n');
  const approved = await reviewOutreach.execute({
    outreachId: outreach.id,
    action: 'edited',
    subject: fallbackSubject,
    body: fallbackBody,
  });

  if (!approved) {
    throw new Error('Failed to approve outreach');
  }

  const sent = await sendOutreach.execute(approved.id);

  if (!sent) {
    throw new Error('Failed to send outreach');
  }

  console.log(
    JSON.stringify(
      {
        leadId: lead.id,
        snapshotId: snapshot.id,
        auditId: audit.id,
        outreachId: sent.id,
        companyName: lead.companyName,
        recipientEmail: 'muradgm@gmail.com',
        subject: sent.subject,
        body: sent.body,
        status: sent.status,
        providerMessageId: sent.providerMessageId,
        deliveryProvider: sent.deliveryProvider,
        senderEmail: env.resendFromEmail,
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
