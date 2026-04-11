import assert from 'node:assert/strict';
import test from 'node:test';
import { DetectSignals } from '../../packages/core/dist/index.js';
import { RuleBasedSignalDetector } from '../../packages/scraper/dist/index.js';
import { buildSnapshotFixture, leadFixture } from './fixtures.mjs';

test('good local lead yields strong signals and explicit trust evidence', async () => {
  const snapshot = await buildSnapshotFixture();
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const result = await useCase.execute(leadFixture, snapshot);

  assert.equal(result.bookingPresence, 'direct');
  assert.equal(result.contactClarity, 'high');
  assert.equal(result.trustSignalStrength, 'high');
  assert.equal(result.localRelevance, 'high_match');
  assert.equal(result.outreachFit, 'good');
  assert.equal(result.confidence, 'high');
  assert.ok(result.evidence.includes('trust indicator detected: mentions long tradition'));
  assert.ok(result.evidence.includes('trust indicator detected: mentions family-led practice'));
  assert.ok(result.evidence.includes('trust indicator detected: mentions anxiety-patient reassurance'));
});

test('district-level address evidence supports non-Berlin local relevance clearly', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-hamburg',
    companyName: 'Praxis Altona',
    website: 'https://praxis-altona.example',
    location: 'Hamburg',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-hamburg',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis Altona Hamburg',
    metaDescription: 'Zahnarztpraxis in Hamburg Altona',
    visibleText:
      'Unsere Praxis in Altona bietet Online-Termine und ein erfahrenes Team. Besuchen Sie uns in Hamburg, Germany.',
    contactInfo: {
      emails: ['kontakt@praxis-altona.example'],
      phones: ['040 123 45 67'],
      addresses: ['Max-Brauer-Allee 22 22765 Hamburg Altona'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions patient comfort', 'mentions team'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:00:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.includes(
      'high-quality location evidence: lead location appears in extracted contact/address data: Hamburg',
    ),
  );
  assert.ok(
    result.evidence.includes('country evidence present in site content: Germany'),
  );
});

test('location alias matching handles Duesseldorf and district-level evidence', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-dusseldorf',
    companyName: 'Praxis Unterbilk',
    website: 'https://praxis-unterbilk.example',
    location: 'Dusseldorf',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-dusseldorf',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis Unterbilk | Duesseldorf Unterbilk',
    metaDescription: 'Lokale Zahnarztpraxis in Duesseldorf Unterbilk',
    visibleText:
      'Freundliches Team und Online booking fuer Patienten in Duesseldorf Unterbilk, Germany.',
    contactInfo: {
      emails: ['kontakt@praxis-unterbilk.example'],
      phones: ['0211 999 88 77'],
      addresses: ['Lorettostrasse 15 40219 Duesseldorf Unterbilk'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions team', 'mentions patient comfort'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:15:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.some((item) =>
      /contact\/address data: (Dusseldorf|duesseldorf|unterbilk)/i.test(item),
    ),
  );
});

test('location alias matching handles Frankfurt am Main and district variants', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-frankfurt',
    companyName: 'Implant Studio Sachsenhausen',
    website: 'https://implant-studio-sachsenhausen.example',
    location: 'Frankfurt am Main',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-frankfurt',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Implant Studio | Frankfurt Sachsenhausen',
    metaDescription: 'Implant-focused dental care in Frankfurt Sachsenhausen, Germany',
    visibleText:
      'Advanced imaging, calm care and online booking for patients in Frankfurt Sachsenhausen, Germany.',
    contactInfo: {
      emails: ['team@implant-studio-sachsenhausen.example'],
      phones: ['069 123 45 678'],
      addresses: ['Brueckenstrasse 28 60594 Frankfurt Sachsenhausen'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions advanced technology', 'mentions patient comfort'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:20:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.includes('country evidence present in site content: Germany'),
  );
});

test('administrative city suffixes still resolve to high local relevance outside Berlin', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-freiburg',
    companyName: 'Praxis Herdern',
    website: 'https://praxis-herdern.example',
    location: 'Freiburg im Breisgau',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-freiburg',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis Herdern | Freiburg Herdern',
    metaDescription: 'Lokale Zahnarztpraxis in Freiburg Herdern, Germany',
    visibleText:
      'Online booking, patient comfort and a local team for families in Freiburg Herdern, Germany.',
    contactInfo: {
      emails: ['kontakt@praxis-herdern.example'],
      phones: ['0761 123 45 67'],
      addresses: ['Habsburgerstrasse 90 79104 Freiburg Herdern'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions patient comfort', 'mentions team'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:25:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.some((item) =>
      /contact\/address data: (freiburg|herdern)/i.test(item),
    ),
  );
});

test('english city aliases still resolve to the correct German city footprint', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-hanover',
    companyName: 'List Smile Studio',
    website: 'https://list-smile-studio.example',
    location: 'Hanover',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-hanover',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'List Smile Studio | Hannover List',
    metaDescription: 'Friendly dental care in Hannover List, Germany',
    visibleText:
      'Book online and visit our calm local practice in Hannover List, Germany.',
    contactInfo: {
      emails: ['hello@list-smile-studio.example'],
      phones: ['0511 222 33 44'],
      addresses: ['Lister Meile 40 30161 Hannover List'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions patient comfort', 'mentions team'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:30:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.some((item) =>
      /contact\/address data: (hanover|hannover|list)/i.test(item),
    ),
  );
});

test('hyphenated district names still resolve as high local relevance', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-heidelberg',
    companyName: 'Neuenheim Dental',
    website: 'https://neuenheim-dental.example',
    location: 'Heidelberg',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-heidelberg',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Neuenheim Dental | Heidelberg-Neuenheim',
    metaDescription: 'Friendly dental care in Heidelberg-Neuenheim, Germany',
    visibleText:
      'Book online and visit our local practice in Heidelberg-Neuenheim, Germany.',
    contactInfo: {
      emails: ['hello@neuenheim-dental.example'],
      phones: ['06221 123456'],
      addresses: ['Ladenburger Strasse 10 69120 Heidelberg-Neuenheim'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions patient comfort', 'mentions team'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:35:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.some((item) =>
      /contact\/address data: (heidelberg|neuenheim)/i.test(item),
    ),
  );
});

test('district aliases with transliteration still resolve across additional non-Berlin cities', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-regensburg',
    companyName: 'Praxis Kumpfmuehl',
    website: 'https://praxis-kumpfmuehl.example',
    location: 'Regensburg',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-regensburg',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis Kumpfmuehl | Regensburg',
    metaDescription: 'Lokale Zahnarztpraxis in Regensburg Kumpfmühl',
    visibleText:
      'Online Termin und ruhige Betreuung fuer Patienten in Regensburg Kumpfmühl, Germany.',
    contactInfo: {
      emails: ['kontakt@praxis-kumpfmuehl.example'],
      phones: ['0941 123 45 67'],
      addresses: ['Kumpfmuehler Strasse 20 93051 Regensburg Kumpfmühl'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions patient comfort', 'mentions team'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:40:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'high_match');
  assert.ok(
    result.evidence.some((item) =>
      /contact\/address data: (regensburg|kumpfmuhl|kumpfmuehl)/i.test(item),
    ),
  );
});

test('shared district names stay partial when page text lacks a unique city tie', async () => {
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const lead = {
    ...leadFixture,
    id: 'lead-dresden-neustadt-ambiguous',
    companyName: 'Endo Studio Neustadt',
    website: 'https://endo-studio-neustadt-ambiguous.example',
    location: 'Dresden',
    country: 'Germany',
    completeness: 'complete',
  };

  const snapshot = {
    id: 'snapshot-dresden-neustadt-ambiguous',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Endo Studio Neustadt',
    metaDescription: 'Endodontie in Neustadt, Germany, mit ruhiger Behandlung und Online-Anfrage.',
    visibleText:
      'Ruhige Wurzelbehandlung, klare Online-Anfrage und patientenfreundliche Begleitung in Neustadt, Germany.',
    contactInfo: {
      emails: ['kontakt@endo-studio-neustadt-ambiguous.example'],
      phones: ['0351 123 45 67'],
      addresses: [],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: ['https://booking.example/neustadt'],
    trustSignals: ['mentions patient comfort', 'mentions team'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:45:00.000Z'),
  };

  const result = await useCase.execute(lead, snapshot);

  assert.equal(result.localRelevance, 'partial_match');
  assert.equal(result.outreachFit, 'good');
  assert.equal(result.confidence, 'medium');
  assert.ok(
    result.evidence.includes(
      'moderate-quality but ambiguous location evidence: district or locality appears in site content without a unique city tie: neustadt',
    ),
  );
  assert.ok(
    result.evidence.includes('country evidence present in site content: Germany'),
  );
});
