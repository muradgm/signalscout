import { parseArgs, parseLimit, printJson, withDb } from './_shared.mjs';

const { flags, positional } = parseArgs(process.argv.slice(2));
const limit = flags.limit === undefined && positional[0] ? parseLimit({ limit: positional[0] }, 50) : parseLimit(flags, 50);

const normalize = (value) =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

const diffKind = (generatedValue, finalValue) => {
  if (!generatedValue && !finalValue) {
    return 'unchanged';
  }

  if (!generatedValue && finalValue) {
    return 'added';
  }

  if (generatedValue && !finalValue) {
    return 'removed';
  }

  return normalize(generatedValue) === normalize(finalValue) ? 'unchanged' : 'edited';
};

const detectLanguageHint = (value) => {
  const normalizedValue = normalize(value);
  const englishHints = ['book online', 'request appointment', 'gentle', 'friendly', 'clear aligner'];
  const germanHints = ['termin', 'zahnarzt', 'praxis', 'angstpatient', 'behandlung'];
  const hasEnglish = englishHints.some((hint) => normalizedValue.includes(hint));
  const hasGerman = germanHints.some((hint) => normalizedValue.includes(hint));

  if (hasEnglish && hasGerman) return 'mixed_en_de';
  if (hasEnglish) return 'english_leaning';
  if (hasGerman) return 'german_leaning';
  return 'unclear';
};

const detectSpecialtyTags = (value) => {
  const normalizedValue = normalize(value);
  const rules = [
    { tag: 'implant', patterns: ['implant', 'implantologie', 'implantology'] },
    { tag: 'oral_surgery', patterns: ['oral surgery', 'oralchirurgie', 'wisdom tooth'] },
    { tag: 'endodontics', patterns: ['endodont', 'root canal', 'wurzel'] },
    { tag: 'aligners', patterns: ['aligner', 'invisalign'] },
    { tag: 'pediatric', patterns: ['kinderzahnarzt', 'pediatric', 'children dentistry'] },
  ];

  return rules
    .filter((rule) => rule.patterns.some((pattern) => normalizedValue.includes(pattern)))
    .map((rule) => rule.tag);
};

await withDb(async ({ db }) => {
  const reviewed = await db
    .collection('outreachmessages')
    .aggregate([
      { $match: { reviewStatus: { $in: ['accepted', 'edited', 'skipped', 'held'] } } },
      { $sort: { reviewedAt: -1, _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'leads',
          localField: 'leadId',
          foreignField: '_id',
          as: 'lead',
        },
      },
      {
        $project: {
          lead: { $arrayElemAt: ['$lead', 0] },
          recommendation: 1,
          reviewStatus: 1,
          status: 1,
          reviewedAt: 1,
          fitReason: 1,
          bestAngle: 1,
          generatedSubject: 1,
          generatedBody: 1,
          subject: 1,
          body: 1,
          sendAttemptCount: 1,
          sentAt: 1,
          lastSendErrorCode: 1,
          lastSendRetryable: 1,
        },
      },
    ])
    .toArray();

  const annotated = reviewed.map((item) => {
    const subjectDelta = diffKind(item.generatedSubject, item.subject);
    const bodyDelta = diffKind(item.generatedBody, item.body);

    return {
      outreachId: String(item._id),
      leadId: item.lead ? String(item.lead._id) : null,
      companyName: item.lead?.companyName ?? null,
      location: item.lead?.location ?? null,
      niche: item.lead?.niche ?? null,
      recommendation: item.recommendation,
      reviewStatus: item.reviewStatus,
      status: item.status,
      reviewedAt: item.reviewedAt,
      bestAngle: item.bestAngle,
      fitReason: item.fitReason,
      subjectDelta,
      bodyDelta,
      sendAttemptCount: item.sendAttemptCount ?? 0,
      sentAt: item.sentAt ?? null,
      lastSendErrorCode: item.lastSendErrorCode ?? null,
      lastSendRetryable: item.lastSendRetryable ?? false,
      languageHint: detectLanguageHint(
        [item.fitReason, item.bestAngle, item.generatedBody, item.body].filter(Boolean).join(' '),
      ),
      specialtyTags: detectSpecialtyTags(
        [item.bestAngle, item.fitReason, item.generatedBody, item.body, item.lead?.companyName, item.lead?.niche]
          .filter(Boolean)
          .join(' '),
      ),
    };
  });

  const reviewStatusBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      accumulator[item.reviewStatus] = (accumulator[item.reviewStatus] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([reviewStatus, count]) => ({ reviewStatus, count }));

  const subjectDeltaBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      accumulator[item.subjectDelta] = (accumulator[item.subjectDelta] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([subjectDelta, count]) => ({ subjectDelta, count }));

  const bodyDeltaBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      accumulator[item.bodyDelta] = (accumulator[item.bodyDelta] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([bodyDelta, count]) => ({ bodyDelta, count }));

  const angleBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      const key = item.bestAngle || 'unknown';
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([bestAngle, count]) => ({ bestAngle, count }));

  const nicheBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      const key = item.niche || 'unknown';
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([niche, count]) => ({ niche, count }));

  const languageBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      accumulator[item.languageHint] = (accumulator[item.languageHint] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([languageHint, count]) => ({ languageHint, count }));

  const specialtyBreakdown = Object.entries(
    annotated.reduce((accumulator, item) => {
      for (const tag of item.specialtyTags) {
        accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      }
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .map(([tag, count]) => ({ tag, count }));

  const highEditExamples = annotated
    .filter((item) => item.reviewStatus === 'edited' || item.subjectDelta === 'edited' || item.bodyDelta === 'edited')
    .slice(0, 10);

  const skippedExamples = annotated.filter((item) => item.reviewStatus === 'skipped').slice(0, 10);

  printJson({
    scope: {
      limit,
    },
    summary: {
      totalReviewed: annotated.length,
      acceptedCount: annotated.filter((item) => item.reviewStatus === 'accepted').length,
      editedCount: annotated.filter((item) => item.reviewStatus === 'edited').length,
      skippedCount: annotated.filter((item) => item.reviewStatus === 'skipped').length,
      heldCount: annotated.filter((item) => item.reviewStatus === 'held').length,
      subjectEditedCount: annotated.filter((item) => item.subjectDelta === 'edited').length,
      bodyEditedCount: annotated.filter((item) => item.bodyDelta === 'edited').length,
    },
    breakdowns: {
      reviewStatus: reviewStatusBreakdown,
      subjectDelta: subjectDeltaBreakdown,
      bodyDelta: bodyDeltaBreakdown,
      angles: angleBreakdown,
      niches: nicheBreakdown,
      languages: languageBreakdown,
      specialties: specialtyBreakdown,
    },
    highEditExamples,
    skippedExamples,
  });
});
