import { parseArgs, parseLimit, printJson, withDb } from './_shared.mjs';

const { flags, positional } = parseArgs(process.argv.slice(2));
const limit = flags.limit === undefined && positional[0] ? parseLimit({ limit: positional[0] }, 25) : parseLimit(flags, 25);
const includeBerlin = flags.includeBerlin === true;
const locationFilter =
  typeof flags.location === 'string' && flags.location.trim().length > 0
    ? flags.location.trim()
    : null;

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const containsAny = (text, values) => values.some((value) => text.includes(value));

const detectLanguageHints = (text) => {
  const normalized = normalize(text);
  const englishHints = [
    'book online',
    'book now',
    'request appointment',
    'appointment',
    'friendly team',
    'patient comfort',
    'modern technology',
  ];
  const germanHints = [
    'termin',
    'zahnarzt',
    'praxis',
    'sprechstunde',
    'angstpatient',
    'behandlung',
    'patienten',
  ];

  const hasEnglish = containsAny(normalized, englishHints);
  const hasGerman = containsAny(normalized, germanHints);

  if (hasEnglish && hasGerman) {
    return 'mixed_en_de';
  }

  if (hasEnglish) {
    return 'english_leaning';
  }

  if (hasGerman) {
    return 'german_leaning';
  }

  return 'unclear';
};

const detectSpecialtyTags = (text) => {
  const normalized = normalize(text);
  const specialtyRules = [
    { tag: 'implant', patterns: ['implant', 'implantology', 'implantologie'] },
    { tag: 'oral_surgery', patterns: ['oral surgery', 'oralchirurgie', 'wisdom tooth'] },
    { tag: 'endodontics', patterns: ['endodont', 'wurzelbehandlung', 'root canal'] },
    { tag: 'aligners', patterns: ['aligner', 'invisalign', 'clear aligner'] },
    { tag: 'pediatric', patterns: ['kinderzahnarzt', 'pediatric', 'children dentistry'] },
    { tag: 'aesthetic', patterns: ['aesthetic', 'aesthet', 'veneers', 'bleaching'] },
  ];

  return specialtyRules
    .filter((rule) => containsAny(normalized, rule.patterns))
    .map((rule) => rule.tag);
};

const compactContactSummary = (snapshot) => ({
  emailCount: snapshot?.contactInfo?.emails?.length ?? 0,
  phoneCount: snapshot?.contactInfo?.phones?.length ?? 0,
  addressCount: snapshot?.contactInfo?.addresses?.length ?? 0,
  bookingLinkCount: snapshot?.bookingLinks?.length ?? 0,
  trustSignalCount: snapshot?.trustSignals?.length ?? 0,
  placeholder: snapshot?.isPlaceholderContent ?? null,
});

await withDb(async ({ db }) => {
  const leadMatch = {};

  if (!includeBerlin && !locationFilter) {
    leadMatch.location = { $not: /berlin/i };
  }

  if (locationFilter) {
    leadMatch.location = new RegExp(locationFilter, 'i');
  }

  const pipeline = [
    { $match: leadMatch },
    { $sort: { updatedAt: -1, _id: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'leadsnapshots',
        let: { leadId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$leadId', '$$leadId'] } } },
          { $sort: { extractedAt: -1, _id: -1 } },
          { $limit: 1 },
        ],
        as: 'latestSnapshot',
      },
    },
    {
      $lookup: {
        from: 'outreachmessages',
        let: { leadId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$leadId', '$$leadId'] } } },
          { $sort: { createdAt: -1, _id: -1 } },
          { $limit: 1 },
        ],
        as: 'latestOutreach',
      },
    },
    {
      $project: {
        companyName: 1,
        website: 1,
        niche: 1,
        location: 1,
        country: 1,
        status: 1,
        updatedAt: 1,
        latestSnapshot: { $arrayElemAt: ['$latestSnapshot', 0] },
        latestOutreach: { $arrayElemAt: ['$latestOutreach', 0] },
      },
    },
  ];

  const leads = await db.collection('leads').aggregate(pipeline).toArray();

  const enriched = leads.map((lead) => {
    const snapshot = lead.latestSnapshot ?? null;
    const text = [
      snapshot?.pageTitle,
      snapshot?.metaDescription,
      snapshot?.visibleText,
      ...(snapshot?.trustSignals ?? []),
    ]
      .filter(Boolean)
      .join(' ');

    const specialtyTags = detectSpecialtyTags(text);
    const languageHint = detectLanguageHints(text);

    return {
      leadId: String(lead._id),
      companyName: lead.companyName,
      location: lead.location,
      niche: lead.niche,
      leadStatus: lead.status,
      updatedAt: lead.updatedAt,
      website: lead.website,
      hasSnapshot: snapshot !== null,
      contact: compactContactSummary(snapshot),
      languageHint,
      specialtyTags,
      reviewStatus: lead.latestOutreach?.reviewStatus ?? null,
      outreachStatus: lead.latestOutreach?.status ?? null,
      recommendation: lead.latestOutreach?.recommendation ?? null,
      reviewedAt: lead.latestOutreach?.reviewedAt ?? null,
    };
  });

  const locationBreakdown = Object.entries(
    enriched.reduce((accumulator, lead) => {
      accumulator[lead.location] = (accumulator[lead.location] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([location, count]) => ({ location, count }));

  const specialtyBreakdown = Object.entries(
    enriched.reduce((accumulator, lead) => {
      for (const tag of lead.specialtyTags) {
        accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      }
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([tag, count]) => ({ tag, count }));

  const languageBreakdown = Object.entries(
    enriched.reduce((accumulator, lead) => {
      accumulator[lead.languageHint] = (accumulator[lead.languageHint] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([languageHint, count]) => ({ languageHint, count }));

  const reviewedLeads = enriched
    .filter((lead) => lead.reviewStatus && lead.reviewStatus !== 'not_reviewed')
  const multilingualLeads = enriched.filter(
    (lead) => lead.languageHint === 'mixed_en_de' || lead.languageHint === 'english_leaning',
  );
  const specialtyLeads = enriched.filter((lead) => lead.specialtyTags.length > 0);

  const reviewedExamples = reviewedLeads.slice(0, 10);

  const multilingualExamples = multilingualLeads.slice(0, 10);
  const specialtyExamples = specialtyLeads.slice(0, 10);

  printJson({
    scope: {
      limit,
      includeBerlin,
      locationFilter,
    },
    summary: {
      totalLeads: enriched.length,
      withSnapshot: enriched.filter((lead) => lead.hasSnapshot).length,
      reviewedOutreach: reviewedLeads.length,
      multilingualCandidates: multilingualLeads.length,
      specialtyCandidates: specialtyLeads.length,
    },
    breakdowns: {
      locations: locationBreakdown,
      languageHints: languageBreakdown,
      specialtyTags: specialtyBreakdown,
    },
    reviewedExamples,
    multilingualExamples,
    specialtyExamples,
  });
});
