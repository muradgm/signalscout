import type {
  GenerateOutreachInput,
  GeneratedOutreachDraft,
  OutreachGenerator,
} from '@signalscout/core';

const hasTrustSignal = (
  input: GenerateOutreachInput,
  signal: string,
): boolean => input.snapshot.trustSignals.includes(signal);

const pickVariant = <T>(variants: T[], input: GenerateOutreachInput): T => {
  const index = input.regenerationIndex ?? 0;
  return variants[index % variants.length] ?? variants[0];
};

const mentionsLongTradition = (text: string): boolean => {
  return /seit uber 50 jahren|over 50 years|seit 50 jahren/i.test(text);
};

const mentionsFamilyPositioning = (text: string): boolean => {
  return /als vater und sohn|father and son|family[- ]led|family practice|familiengefuhrt|familiengefuhrte|familienzahnarzt/i.test(
    text,
  );
};

const mentionsComfortReassurance = (text: string): boolean => {
  return /wohlbefinden|angstpatienten|schonende|schmerzfreie|kinderecke|aquarium/i.test(
    text,
  );
};

const getSnapshotText = (
  snapshot: GenerateOutreachInput['snapshot'],
): string => {
  return `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
};

const hasStrongTrustNarrative = (input: GenerateOutreachInput): boolean => {
  if (input.signals.confidence !== 'medium') {
    return false;
  }

  const auditText = [
    input.audit.summary,
    input.audit.confidenceNote,
    input.audit.recommendedAngle,
    ...(input.audit.evidence ?? []),
    ...(input.audit.opportunities ?? []),
    ...(input.audit.opportunityDetails ?? []),
  ]
    .filter(Boolean)
    .join(' ');

  if (
    /family-led,\s*long-standing positioning|father and son|family-led practice/i.test(
      auditText,
    )
  ) {
    return true;
  }

  const combinedText = getSnapshotText(input.snapshot);

  return (
    hasTrustSignal(input, 'mentions long tradition') ||
    hasTrustSignal(input, 'mentions family-led practice') ||
    mentionsLongTradition(combinedText) ||
    mentionsFamilyPositioning(combinedText)
  );
};

const hasLocationQualificationRisk = (
  input: GenerateOutreachInput,
): boolean => {
  if (input.signals.localRelevance === 'low_match') {
    return true;
  }

  const auditText = [
    input.audit.summary,
    input.audit.confidenceNote,
    input.audit.recommendedAngle,
    ...input.audit.evidence,
  ]
    .filter(Boolean)
    .join(' ');

  return /does not line up cleanly with the recorded lead (geography|location)|qualification gap/i.test(
    auditText,
  );
};

const withIndefiniteArticle = (phrase: string): string => {
  return /^[aeiou]/i.test(phrase) ? `an ${phrase}` : `a ${phrase}`;
};

const detectSpecialtyFocus = (text: string): string | null => {
  const focuses: string[] = [];

  if (/implant(?:e|ologie|ology|at)/i.test(text)) {
    focuses.push('implant-focused care');
  }

  if (
    /kinderzahn|kinderzahnarzt|pediatric dentistry|children'?s dentistry|kids dentistry/i.test(
      text,
    )
  ) {
    focuses.push('family and pediatric care');
  }

  if (/oral surgery|oralchirurg|oralchirurgie|weisheitszahn/i.test(text)) {
    focuses.push('oral-surgery care');
  }

  if (/invisalign|aligner/i.test(text)) {
    focuses.push('aligner-focused treatment');
  }

  if (
    /\bendo(?:\s|$|-|studio|praxis)|endodont|endodontie|endodontics|wurzelbehandlung|wurzelkanal|root canal/i.test(
      text,
    )
  ) {
    focuses.push('endodontic care');
  }

  if (/parodont/i.test(text)) {
    focuses.push('periodontal care');
  }

  if (focuses.length > 1) {
    return 'multi-specialty practice';
  }

  return focuses[0] ?? null;
};

const detectLanguageTone = (
  text: string,
): 'bilingual' | 'english_led' | null => {
  const hasEnglish = /book online|request appointment|request consultation|online booking|online appointment|friendly dental care|dental care in|patient comfort|modern technology|calm support|calm patient|team directly|call our team|request your consultation|clear aligner|clear aligner care/i.test(
    text,
  );
  const hasGerman = /zahnarzt|zahnarztpraxis|praxis|termin|patienten|behandlung|angstpatienten|familien|familienfreundlich|kinderecke|kinderzahnarzt|implantologie|implant|endodont|oralchir|aligner|wurzelbehandlung|online-termin|anfrageformular/i.test(
    text,
  );

  if (hasEnglish && hasGerman) {
    return 'bilingual';
  }

  if (
    hasEnglish &&
    /berlin|cologne|munich|hamburg|stuttgart|bonn|dresden|kiel|leipzig|freiburg|hanover|hannover|heidelberg|regensburg|muenster|nuernberg|nuremberg|dusseldorf|duesseldorf/i.test(
      text,
    )
  ) {
    return 'english_led';
  }

  return null;
};

const describeContactSurface = (
  input: GenerateOutreachInput,
): 'both' | 'email_only' | 'phone_only' | 'none' => {
  const hasEmail = input.snapshot.contactInfo.emails.length > 0;
  const hasPhone = input.snapshot.contactInfo.phones.length > 0;

  if (hasEmail && hasPhone) {
    return 'both';
  }

  if (hasEmail) {
    return 'email_only';
  }

  if (hasPhone) {
    return 'phone_only';
  }

  return 'none';
};

const hasThinDirectBooking = (input: GenerateOutreachInput): boolean => {
  return input.signals.bookingPresence === 'direct' && describeContactSurface(input) === 'none';
};

const isBorderlineScaledLocalReviewLead = (
  input: GenerateOutreachInput,
): boolean => {
  const text = getSnapshotText(input.snapshot);
  const tone = detectLanguageTone(text);
  const specialtyFocus = detectSpecialtyFocus(text);
  const hasComfort =
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(text);
  const hasVisibleLocalSurface =
    input.snapshot.contactInfo.emails.length > 0 &&
    input.snapshot.contactInfo.phones.length > 0 &&
    input.snapshot.contactInfo.addresses.length > 0;

  return (
    (input.signals.businessScale === 'large_chain' ||
      input.signals.businessScale === 'multi_location') &&
    input.signals.localRelevance === 'high_match' &&
    input.signals.trustSignalStrength === 'high' &&
    input.signals.contactClarity === 'high' &&
    input.signals.bookingPresence !== 'not_detected' &&
    hasVisibleLocalSurface &&
    (tone === 'bilingual' || specialtyFocus !== null || hasComfort)
  );
};

const buildPlaceholderOutreach = (
  input: GenerateOutreachInput,
): GeneratedOutreachDraft => {
  const { snapshot, audit } = input;

  return {
    recommendation: 'do_not_send',
    fitReason:
      'The website appears to be placeholder or inactive content, so there is not enough real information to justify outreach.',
    bestAngle:
      'Do not revisit this lead until the website shows real business content and a usable public-facing experience.',
    subject: null,
    body: null,
    reasoning:
      'The current site state does not provide a credible basis for outreach. Any message generated from placeholder content would be poorly grounded and likely misleading.',
    evidence: [
      ...(snapshot.pageTitle
        ? [`The page title indicates placeholder-style content: ${snapshot.pageTitle}`]
        : []),
      'Visible page content is too limited to support a meaningful outreach decision.',
      ...(snapshot.contactInfo.emails.length > 0
        ? [`Only minimal contact content was visible, including: ${snapshot.contactInfo.emails[0]}`]
        : []),
      `Confidence note: ${audit.confidenceNote}`,
    ],
  };
};

const buildDoNotSendFitReason = (input: GenerateOutreachInput): string => {
  const { signals } = input;

  if (signals.businessScale === 'large_chain') {
    return 'This lead reads as a scaled multi-location network rather than a locally owned practice, so it falls outside the strongest fit for the current outreach wedge.';
  }

  if (signals.localRelevance === 'low_match') {
    return 'The business does not appear to align closely enough with the intended local-market focus to justify outreach right now.';
  }

  return 'The lead does not align strongly enough with the current local-practice outreach strategy.';
};

const buildDoNotSendBestAngle = (input: GenerateOutreachInput): string => {
  const { signals } = input;

  if (signals.businessScale === 'large_chain') {
    return 'Only revisit this lead with a more strategic, network-level angle tied to larger operational or conversion questions.';
  }

  return 'Only revisit this lead if a more relevant positioning angle becomes clear.';
};

const buildDoNotSendReasoning = (input: GenerateOutreachInput): string => {
  const { signals } = input;

  if (signals.businessScale === 'large_chain') {
    return 'The business operates at a scale that does not match the current local-practice campaign focus. Generating a send-ready message here would create activity without a strong reason to expect a useful outcome.';
  }

  if (signals.localRelevance === 'low_match') {
    return 'The targeting mismatch is large enough that a send-ready message would be more misleading than useful at this stage.';
  }

  return 'The lead does not show enough alignment with the current offer to justify producing a send-ready outreach draft.';
};

const buildDoNotSendEvidence = (input: GenerateOutreachInput): string[] => {
  const { snapshot, signals, audit } = input;
  const evidence: string[] = [];

  if (signals.businessScale === 'large_chain') {
    evidence.push(
      'The business presents itself as a large multi-location provider rather than a single local practice.',
    );
  }

  if (signals.localRelevance === 'low_match') {
    evidence.push(
      'The recorded lead location is not clearly reflected in the site content.',
    );
  }

  if (signals.bookingPresence === 'indirect') {
    evidence.push(
      'Booking intent is visible, but the path to action does not appear especially direct.',
    );
  }

  if (signals.trustSignalStrength === 'high') {
    evidence.push(
      'The site already communicates strong credibility through trust and scale cues.',
    );
  }

  if (snapshot.pageTitle) {
    evidence.push(
      `The page title reinforces the current site positioning: ${snapshot.pageTitle}`,
    );
  }

  if (snapshot.metaDescription) {
    evidence.push(
      `The meta description emphasizes reach and availability: ${snapshot.metaDescription}`,
    );
  }

  if (audit.confidenceNote) {
    evidence.push(`Confidence note: ${audit.confidenceNote}`);
  }

  return [...new Set(evidence)].slice(0, 6);
};

const buildBorderlineScaledLocalReviewFitReason = (): string => {
  return 'The lead sits between a scaled dental brand and a locally credible clinic, so it is better handled as a review case than an automatic pass.';
};

const buildBorderlineScaledLocalReviewSubject = (
  input: GenerateOutreachInput,
): string => {
  return pickVariant(
    [
      `Quick idea for making new-patient booking clearer at ${input.lead.companyName}`,
      `Quick thought on turning trust into bookings at ${input.lead.companyName}`,
      `One trust-to-booking idea for ${input.lead.companyName}`,
    ],
    input,
  );
};

const buildBorderlineScaledLocalReviewBestAngle = (): string => {
  return 'Lead with the trust already visible on the site, then test whether the booking path could turn that credibility into a clearer next step for new patients.';
};

const buildBorderlineScaledLocalReviewBody = (
  input: GenerateOutreachInput,
): string => {
  const hasComfort =
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(getSnapshotText(input.snapshot));
  const comfortCue = hasComfort
    ? 'patient comfort,'
    : 'the trust already visible on the site,';

  return pickVariant(
    [
      `Hi,

I took a look at ${input.lead.companyName}, and the site already gives a strong first impression, especially around ${comfortCue} visible treatment breadth, and the clear route for new patients.

What makes this a review case instead of an automatic send is that the business also reads larger and more brand-led than a typical local-practice fit.

If I were testing an outreach angle here, I would lead with whether the booking path could turn that trust into a more immediate next step for new patients.

If useful, I can share a short version I would test first.

Best,
[Your Name]`,
      `Hi,

I spent a bit of time on ${input.lead.companyName}. The site already feels credible for new patients, especially around ${comfortCue} service breadth, and visible contact paths.

The part I would still treat carefully is that the business reads more scaled and brand-led than a normal single-practice fit, so this feels better as a reviewed draft than an automatic send.

The angle I would test is whether the booking path could make that trust feel more immediate for someone ready to book.

If useful, I can share a short version I would test first.

Best,
[Your Name]`,
    ],
    input,
  );
};

const buildBorderlineScaledLocalReviewReasoning = (): string => {
  return 'The site carries real local trust and a visible booking path, but the brand-led footprint still makes a fully automated send too aggressive. That makes this better handled as a reviewed trust-to-booking case than a hard pass.';
};

const buildBorderlineScaledLocalReviewEvidence = (
  input: GenerateOutreachInput,
): string[] => {
  const evidence: string[] = [
    'The site uses network-style branding and multiple location references rather than a simple single-practice story.',
  ];

  if (input.snapshot.bookingLinks[0]) {
    evidence.push(`A direct booking path is already present: ${input.snapshot.bookingLinks[0]}`);
  }

  evidence.push('Contact options and a local address are clearly visible on the page.');

  if (
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(getSnapshotText(input.snapshot))
  ) {
    evidence.push('The messaging strongly emphasizes patient comfort and reassurance.');
  }

  if (input.audit.opportunities.length > 0) {
    evidence.push(`Audit opportunity identified: ${input.audit.opportunities[0]}`);
  }

  return [...new Set(evidence)].slice(0, 5);
};

const buildReviewFitReason = (input: GenerateOutreachInput): string => {
  if (hasLocationQualificationRisk(input)) {
    return 'The lead is directionally relevant, but the site does not line up cleanly with the recorded lead geography, so a human should confirm the angle and wording before anything is sent.';
  }

  return 'The lead shows some alignment, but the fit is not yet strong enough to justify fully automated outreach without a human check.';
};

const buildReviewSubject = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);

  if (hasLocationQualificationRisk(input)) {
    return `Quick check on geographic fit for ${input.lead.companyName}`;
  }

  if (specialtyFocus) {
    return `Quick check on ${specialtyFocus} at ${input.lead.companyName}`;
  }

  if (tone === 'bilingual') {
    return `Quick check on bilingual booking at ${input.lead.companyName}`;
  }

  if (tone === 'english_led') {
    return `Quick check on English-led booking at ${input.lead.companyName}`;
  }

  return `A quick thought on booking flow at ${input.lead.companyName}`;
};

const buildReviewBestAngle = (input: GenerateOutreachInput): string => {
  const specialtyFocus = detectSpecialtyFocus(getSnapshotText(input.snapshot));
  const tone = detectLanguageTone(getSnapshotText(input.snapshot));

  if (hasLocationQualificationRisk(input)) {
    return 'Lead with the qualification gap first, then narrow the message to one believable next-step improvement.';
  }

  if (specialtyFocus) {
    return `Lead with ${specialtyFocus} and a simpler path from intent to action.`;
  }

  if (tone === 'bilingual') {
    return 'Lead with the bilingual presentation, then make the next step feel simpler and more immediate.';
  }

  if (tone === 'english_led') {
    return 'Lead with the English-led clarity, then make the next step feel simpler and more immediate.';
  }

  return 'Lead with booking clarity and a simpler path from intent to action.';
};

const buildReviewBody = (input: GenerateOutreachInput): string => {
  const { lead, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const contactSurface = describeContactSurface(input);

  const specialtySentence =
    specialtyFocus === 'multi-specialty practice'
      ? 'That feels especially relevant for a multi-specialty practice.'
      : specialtyFocus
        ? `That feels especially relevant for ${withIndefiniteArticle(specialtyFocus)} practice.`
        : '';
  const languageSentence =
    tone === 'bilingual'
      ? 'The bilingual presentation is strong, but the booking step still needs a human check.'
      : tone === 'english_led'
        ? 'The English-led presentation is strong, but the booking step still needs a human check.'
        : '';
  const contactSentence =
    contactSurface === 'email_only'
      ? 'The contact setup is email-only, so the wording should stay very tight before anything is sent.'
      : contactSurface === 'phone_only'
        ? 'The contact setup is phone-only, so the wording should stay very tight before anything is sent.'
        : contactSurface === 'none'
          ? 'No clear contact path stands out, so the wording should stay very tight before anything is sent.'
          : '';
  const extraCopy = [specialtySentence, languageSentence, contactSentence]
    .filter(Boolean)
    .join(' ');

  if (hasLocationQualificationRisk(input)) {
    return pickVariant(
      [
        `Hi,

I came across ${lead.companyName}, and one thing stood out: the fit is interesting, but the geography still needs a human check.${extraCopy ? ` ${extraCopy}` : ''}

That keeps this in review territory for now rather than a send-ready draft.

If useful, I can share a short perspective on whether the angle is worth pursuing.

Best,
[Your Name]`,
        `Hi,

I took a look at ${lead.companyName}. The lead looks directionally relevant, but the recorded geography still needs a quick check.${extraCopy ? ` ${extraCopy}` : ''}

That makes this a review case rather than something I would send as-is.

If useful, I can share a short perspective on whether the angle is worth pursuing.

Best,
[Your Name]`,
      ],
      input,
    );
  }

  return pickVariant(
    [
      `Hi,

I came across ${lead.companyName}, and the fit is directionally interesting, but I would still want a human to confirm the angle before anything is sent.${extraCopy ? ` ${extraCopy}` : ''}

That usually means the lead is worth reviewing, but not yet ready for a fully automated draft.

If useful, I can share a short perspective on whether the angle is worth pursuing.

Best,
[Your Name]`,
      `Hi,

I took a quick look at ${lead.companyName}. The lead seems close enough to review, but still a little ambiguous for a send-ready draft.${extraCopy ? ` ${extraCopy}` : ''}

That is usually a sign that the wording should be checked before anything goes out.

If useful, I can share a short perspective on whether the angle is worth pursuing.

Best,
[Your Name]`,
    ],
    input,
  );
};

const buildReviewReasoning = (input: GenerateOutreachInput): string => {
  const contactSurface = describeContactSurface(input);

  if (hasLocationQualificationRisk(input)) {
    return 'The lead is directionally relevant, but still ambiguous enough that a human should confirm the geographic match and the wording before anything is sent.';
  }

  if (contactSurface === 'email_only') {
    return 'The lead is directionally relevant, but the contact surface is email-only, so a human should confirm the wording before anything is sent.';
  }

  if (contactSurface === 'phone_only') {
    return 'The lead is directionally relevant, but the contact surface is phone-only, so a human should confirm the wording before anything is sent.';
  }

  return 'The lead is directionally relevant, but still ambiguous enough that a human should confirm the angle and wording before anything is sent.';
};

const buildReviewEvidence = (input: GenerateOutreachInput): string[] => {
  const { signals, snapshot } = input;
  const evidence: string[] = [];
  const specialtyFocus = detectSpecialtyFocus(getSnapshotText(snapshot));
  const tone = detectLanguageTone(getSnapshotText(snapshot));
  const contactSurface = describeContactSurface(input);

  if (hasLocationQualificationRisk(input)) {
    evidence.push('The audit flags a local-market qualification gap that should be checked before anything is sent.');
  }

  if (signals.bookingPresence === 'indirect') {
    evidence.push(
      'The site signals booking intent, but the path to booking may not be as direct as it could be.',
    );
  }

  if (signals.contactClarity === 'medium') {
    evidence.push(
      'The contact experience looks broad rather than tightly guided toward one obvious next step.',
    );
  }

  if (signals.trustSignalStrength === 'high') {
    evidence.push(
      'The business already presents strong trust cues, which makes a generic credibility pitch less compelling.',
    );
  }

  if (signals.localRelevance === 'low_match' || hasLocationQualificationRisk(input)) {
    evidence.push('The site does not line up cleanly with the recorded lead location.');
  }

  if (specialtyFocus) {
    evidence.push(`The site makes its ${specialtyFocus} visible, which supports a more specific outreach angle.`);
  }

  if (tone === 'bilingual') {
    evidence.push('The site uses both German and English, which makes the lead feel more accessible.');
  } else if (tone === 'english_led') {
    evidence.push('The site is English-led while still naming the local market explicitly.');
  }

  if (contactSurface === 'email_only') {
    evidence.push('An email path stands out, but no phone path stands out.');
  } else if (contactSurface === 'phone_only') {
    evidence.push('A phone path stands out, but no email path stands out.');
  } else if (contactSurface === 'none') {
    evidence.push('No clear contact path stands out.');
  }

  if (snapshot.metaDescription) {
    evidence.push(
      `The site messaging emphasizes availability and reach: ${snapshot.metaDescription}`,
    );
  }

  return [...new Set(evidence)].slice(0, 5);
};

const buildGoodLeadFitReason = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);
  const contactSurface = describeContactSurface(input);

  if (specialtyFocus) {
    return `The lead is strongly aligned with the current local-practice outreach strategy, and the visible ${specialtyFocus} focus makes it specific enough to justify a send-ready draft.`;
  }

  if (hasStrongTrustNarrative(input)) {
    return 'The lead is strongly aligned with the current local-practice outreach strategy, and the strong trust narrative makes it specific enough to justify a send-ready draft.';
  }

  if (tone === 'bilingual') {
    return 'The lead is strongly aligned with the current local-practice outreach strategy, and the bilingual presentation makes it specific enough to justify a send-ready draft.';
  }

  if (tone === 'english_led') {
    return 'The lead is strongly aligned with the current local-practice outreach strategy, and the English-led presentation makes it specific enough to justify a send-ready draft.';
  }

  if (contactSurface === 'email_only') {
    return 'The lead is strongly aligned with the current local-practice outreach strategy, but the send-ready draft should stay narrow because only an email path stands out.';
  }

  if (contactSurface === 'phone_only') {
    return 'The lead is strongly aligned with the current local-practice outreach strategy, but the send-ready draft should stay narrow because only a phone path stands out.';
  }

  return 'The lead is strongly aligned with the current local-practice outreach strategy and shows enough real commercial signal to justify a send-ready draft.';
};

const buildMediumValidFitReason = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);
  const contactSurface = describeContactSurface(input);
  const trustNarrativeLead =
    input.signals.trustSignalStrength === 'high' && input.signals.confidence === 'medium';
  const strongTrustNarrative = hasStrongTrustNarrative(input);

  if (specialtyFocus) {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' Only an email path stands out.'
        : contactSurface === 'phone_only'
          ? ' Only a phone path stands out.'
          : '';

    return `The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because the visible ${specialtyFocus} focus still needs a more immediate booking hook.${contactSuffix}`;
  }

  if (tone === 'bilingual') {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' Only an email path stands out.'
        : contactSurface === 'phone_only'
          ? ' Only a phone path stands out.'
          : '';

    return `The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because the bilingual presentation still needs a more immediate booking hook.${contactSuffix}`;
  }

  if (tone === 'english_led') {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' Only an email path stands out.'
        : contactSurface === 'phone_only'
          ? ' Only a phone path stands out.'
          : '';

    return `The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because the English-led presentation still needs a more immediate booking hook.${contactSuffix}`;
  }

  if (trustNarrativeLead) {
    return 'The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because the trust story is strong enough to deserve a trust-led angle instead of a generic booking note.';
  }

  if (hasThinDirectBooking(input)) {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' Only an email path stands out.'
        : contactSurface === 'phone_only'
          ? ' Only a phone path stands out.'
          : contactSurface === 'none'
            ? ' No clear contact path stands out.'
            : '';

    return `The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because the site already offers a direct booking path while the surrounding contact surface still feels thinner than the strongest leads.${contactSuffix}`;
  }

  if (contactSurface === 'email_only') {
    return 'The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because only an email path stands out.';
  }

  if (contactSurface === 'phone_only') {
    return 'The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower because only a phone path stands out.';
  }

  if (strongTrustNarrative) {
    return 'The lead is commercially usable and locally relevant, but the case is still thinner than a top-tier send candidate and the outreach should stay narrower because the trust story is strong enough to be specific, not generic.';
  }

  return 'The lead is commercially usable and locally relevant, but the case is thinner than a top-tier send candidate and the outreach should stay narrower and more grounded.';
};

const buildMediumValidBestAngle = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);
  const contactSurface = describeContactSurface(input);

  if (specialtyFocus) {
    return `Lead with ${specialtyFocus} and one specific improvement that makes the next step feel easier and more immediate.`;
  }

  if (tone === 'bilingual') {
    return 'Lead with the bilingual presentation, then point to one specific improvement that makes the next step feel easier and more immediate.';
  }

  if (tone === 'english_led') {
    return 'Lead with the English-led presentation, then point to one specific improvement that makes the next step feel easier and more immediate.';
  }

  if (hasThinDirectBooking(input)) {
    return 'Lead with the direct booking path, then point to one specific improvement that makes the surrounding contact experience feel less thin and more immediate.';
  }

  if (contactSurface === 'email_only') {
    return 'Lead with one specific improvement that makes the next step feel easier without pretending the site offers more than an email response path.';
  }

  if (contactSurface === 'phone_only') {
    return 'Lead with one specific improvement that makes the next step feel easier without pretending the site offers more than a phone response path.';
  }

  return 'Lead with one specific improvement that makes the next step feel easier and more immediate for someone already considering the practice.';
};

const buildGoodLeadBestAngle = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);
  const contactSurface = describeContactSurface(input);

  if (specialtyFocus) {
    return `Lead with ${specialtyFocus} and the gap between strong trust-building and a more decisive booking case.`;
  }

  if (tone === 'bilingual') {
    return 'Lead with the bilingual presentation and the gap between strong trust-building and a more decisive booking case.';
  }

  if (tone === 'english_led') {
    return 'Lead with the English-led presentation and the gap between strong trust-building and a more decisive booking case.';
  }

  if (contactSurface === 'email_only') {
    return 'Lead with the email-only path and the gap between strong trust-building and a more decisive booking case.';
  }

  if (contactSurface === 'phone_only') {
    return 'Lead with the phone-only path and the gap between strong trust-building and a more decisive booking case.';
  }

  return 'Lead with the gap between strong trust-building and a more decisive booking case.';
};

const buildGoodLeadSubject = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);
  const strongTrustNarrative = hasStrongTrustNarrative(input);

  if (specialtyFocus) {
    return pickVariant(
      [
        `Quick thought on ${specialtyFocus} at ${input.lead.companyName}`,
        `One ${specialtyFocus} idea for ${input.lead.companyName}`,
        `A quick conversion thought for ${specialtyFocus} at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (strongTrustNarrative) {
    return pickVariant(
      [
        `A quick idea on turning trust into bookings at ${input.lead.companyName}`,
        `Quick thought on the trust-to-booking gap at ${input.lead.companyName}`,
        `One trust-to-booking idea for ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (tone === 'bilingual') {
    return pickVariant(
      [
        `Quick thought on clear booking at ${input.lead.companyName}`,
        `One bilingual booking idea for ${input.lead.companyName}`,
        `A quick idea for simpler booking at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (tone === 'english_led') {
    return pickVariant(
      [
        `Quick thought on clear booking at ${input.lead.companyName}`,
        `One English-led booking idea for ${input.lead.companyName}`,
        `A quick idea for simpler booking at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  return pickVariant(
    [
      `Quick thought on ${input.lead.companyName}`,
      `One idea for ${input.lead.companyName}`,
      `A quick conversion thought for ${input.lead.companyName}`,
    ],
    input,
  );
};

const buildGoodLeadBody = (input: GenerateOutreachInput): string => {
  const { lead, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const contactSurface = describeContactSurface(input);
  const strongTrustNarrative = hasStrongTrustNarrative(input);

  const hasTradition = strongTrustNarrative || mentionsLongTradition(combinedText);
  const hasFamily = strongTrustNarrative || mentionsFamilyPositioning(combinedText);
  const hasComfort =
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(combinedText);
  const specialtySentence =
    specialtyFocus === 'multi-specialty practice'
      ? 'That feels especially relevant for a multi-specialty practice, where the next step should feel specific and easy to act on.'
      : specialtyFocus
        ? `That feels especially relevant for ${withIndefiniteArticle(specialtyFocus)} practice, where the next step should feel specific and easy to act on.`
        : '';
  const languageSentence =
    tone === 'bilingual'
      ? 'The bilingual presentation is a strength, but the booking step still needs to feel unmistakable.'
      : tone === 'english_led'
        ? 'The English-led presentation is a strength, but the booking step still needs to feel unmistakable.'
        : '';
  const contactSentence =
    contactSurface === 'email_only'
      ? 'The contact setup is email-only right now, so the next step should stay very simple.'
      : contactSurface === 'phone_only'
        ? 'The contact setup is phone-only right now, so the next step should stay very simple.'
        : contactSurface === 'none'
          ? 'No clear contact path stands out, so the message should stay focused on one simple action.'
          : '';
  const extraCopy = [specialtySentence, languageSentence, contactSentence]
    .filter(Boolean)
    .join(' ');

  if (hasTradition || hasFamily || hasComfort) {
    const trustCue =
      hasTradition && hasFamily
        ? 'the long-standing local presence and family feel'
        : hasTradition
          ? 'the long-standing local presence'
          : hasFamily
            ? 'the family feel'
            : 'the reassurance on the page';

    return pickVariant(
      [
        `Hi,

I took a quick look at ${lead.companyName}. The site already builds a lot of trust, especially around ${trustCue}.${extraCopy ? ` ${extraCopy}` : ''}

My main thought is that the step from reassurance to booking still feels a little softer than it should.

So someone who already feels good about the practice may still not get pushed quite enough to book.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`,
        `Hi,

I spent a bit of time on ${lead.companyName}. The trust side is already strong, especially around ${trustCue}.${extraCopy ? ` ${extraCopy}` : ''}

The part that still feels lighter than it should is the move from that reassurance into actually booking.

So the site is likely doing a good job calming people, but a weaker job nudging them over the line.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`,
        `Hi,

I took a look at ${lead.companyName}. There is already a lot working in terms of trust, especially around ${trustCue}.${extraCopy ? ` ${extraCopy}` : ''}

What feels slightly underplayed is the moment where that trust should turn into a stronger booking decision.

So a visitor can leave feeling positive about the practice without feeling quite enough urgency to take the next step.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`,
      ],
      input,
    );
  }

  return pickVariant(
    [
      `Hi,

I took a quick look at ${lead.companyName}. The site already feels credible, but the step from trust to booking could be more direct.${extraCopy ? ` ${extraCopy}` : ''}

That usually means some interested visitors are probably hesitating a bit longer than they should before taking the next step.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`,
      `Hi,

I spent a bit of time on ${lead.companyName}. The site already feels credible, but the path into booking still feels a little softer than it needs to.${extraCopy ? ` ${extraCopy}` : ''}

That can leave some interested visitors lingering longer than they should before acting.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`,
    ],
    input,
  );
};

const buildMediumValidSubject = (input: GenerateOutreachInput): string => {
  const text = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(text);
  const tone = detectLanguageTone(text);
  const contactSurface = describeContactSurface(input);
  const trustNarrativeLead =
    input.signals.trustSignalStrength === 'high' && input.signals.confidence === 'medium';

  if (specialtyFocus) {
    return pickVariant(
      [
        `Quick thought on ${specialtyFocus} at ${input.lead.companyName}`,
        `One ${specialtyFocus} idea for ${input.lead.companyName}`,
        `A quick conversion thought for ${specialtyFocus} at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (tone === 'bilingual') {
    return pickVariant(
      [
        `Quick thought on bilingual booking at ${input.lead.companyName}`,
        `One bilingual booking idea for ${input.lead.companyName}`,
        `A quick idea for simpler booking at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (tone === 'english_led') {
    return pickVariant(
      [
        `Quick thought on English-led booking at ${input.lead.companyName}`,
        `One English-led booking idea for ${input.lead.companyName}`,
        `A quick idea for simpler booking at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (trustNarrativeLead) {
    return pickVariant(
      [
        `A quick idea on turning trust into bookings at ${input.lead.companyName}`,
        `Quick thought on the trust-to-booking gap at ${input.lead.companyName}`,
        `One trust-to-booking idea for ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (hasThinDirectBooking(input)) {
    return pickVariant(
      [
        `Quick thought on direct booking at ${input.lead.companyName}`,
        `One direct booking idea for ${input.lead.companyName}`,
        `A quick idea for a simpler direct-booking step at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (contactSurface === 'email_only') {
    return pickVariant(
      [
        `Quick thought on email-only booking at ${input.lead.companyName}`,
        `One email-only idea for ${input.lead.companyName}`,
        `A quick idea for a simpler next step at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  if (contactSurface === 'phone_only') {
    return pickVariant(
      [
        `Quick thought on phone-only booking at ${input.lead.companyName}`,
        `One phone-only idea for ${input.lead.companyName}`,
        `A quick idea for a simpler next step at ${input.lead.companyName}`,
      ],
      input,
    );
  }

  return pickVariant(
    [
      `Quick thought on making booking easier at ${input.lead.companyName}`,
      `One booking idea for ${input.lead.companyName}`,
      `A quick conversion thought for ${input.lead.companyName}`,
    ],
    input,
  );
};

const buildMediumValidBody = (input: GenerateOutreachInput): string => {
  const { lead, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const contactSurface = describeContactSurface(input);
  const hasDirectBooking = hasThinDirectBooking(input);
  const trustNarrativeLead =
    input.signals.trustSignalStrength === 'high' && input.signals.confidence === 'medium';

  const hasTradition =
    hasTrustSignal(input, 'mentions long tradition') ||
    mentionsLongTradition(combinedText);
  const hasComfort =
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(combinedText);
  const specialtySentence =
    specialtyFocus === 'multi-specialty practice'
      ? 'That feels especially relevant for a multi-specialty practice.'
      : specialtyFocus
        ? `That feels especially relevant for ${withIndefiniteArticle(specialtyFocus)} practice.`
        : '';
  const languageSentence =
    tone === 'bilingual'
      ? 'The bilingual presentation is a strength, but the next step still needs to feel more immediate.'
      : tone === 'english_led'
        ? 'The English-led presentation is a strength, but the next step still needs to feel more immediate.'
        : '';
  const bookingSentence = hasDirectBooking
    ? 'The site already gives people a direct way to book, but the surrounding contact surface still feels thinner than the strongest leads.'
    : '';
  const contactSentence =
    contactSurface === 'email_only'
      ? 'The contact setup is email-only, so the next step should stay very simple.'
      : contactSurface === 'phone_only'
        ? 'The contact setup is phone-only, so the next step should stay very simple.'
        : contactSurface === 'none'
          ? 'No clear contact path stands out, so the message should stay focused on one simple next step.'
          : '';
  const extraCopy = [specialtySentence, languageSentence, bookingSentence, contactSentence]
    .filter(Boolean)
    .join(' ');

  const credibilityCue = hasTradition
    ? 'The site already gives a credible first impression, especially around its long-standing local presence.'
    : hasComfort
      ? 'The site already gives a credible first impression, especially around the reassuring tone on the page.'
      : trustNarrativeLead
        ? 'The site already gives a credible first impression, especially around the family-led trust story.'
      : hasDirectBooking
        ? 'The site already gives a credible first impression through its direct booking path.'
        : 'The site already gives a credible first impression.';

  return pickVariant(
    [
      `Hi,

I took a quick look at ${lead.companyName}. ${credibilityCue}${extraCopy ? ` ${extraCopy}` : ''}

My main thought is that someone who is interested in booking may still have to work a little harder than they should to take the next step.

That usually points to a solid local practice with a real opportunity to make the conversion path feel clearer and more immediate.

If useful, I can send over 2 or 3 concrete changes I'd look at first.

Best,
[Your Name]`,
      `Hi,

I spent a bit of time on ${lead.companyName}. ${credibilityCue}${extraCopy ? ` ${extraCopy}` : ''}

The main opportunity looks less like trust-building and more like making the next step feel simpler once someone is already interested.

That usually means the practice is directionally strong, but the conversion path still has room to feel clearer and more immediate.

If useful, I can send over 2 or 3 concrete changes I'd look at first.

Best,
[Your Name]`,
      `Hi,

I took a look at ${lead.companyName}. ${credibilityCue}${extraCopy ? ` ${extraCopy}` : ''}

What stood out is that the site feels solid enough to create interest, but the final step into booking still feels a little too easy to postpone.

That is usually a narrower fix than it sounds, but it can still matter commercially.

If useful, I can send over 2 or 3 concrete changes I'd look at first.

Best,
[Your Name]`,
    ],
    input,
  );
};

const buildMediumValidReasoning = (input: GenerateOutreachInput): string => {
  const hasIndirectBooking = input.signals.bookingPresence === 'indirect';
  const hasMediumTrust = input.signals.trustSignalStrength === 'medium';
  const specialtyFocus = detectSpecialtyFocus(getSnapshotText(input.snapshot));
  const tone = detectLanguageTone(getSnapshotText(input.snapshot));
  const contactSurface = describeContactSurface(input);
  const strongTrustNarrative = hasStrongTrustNarrative(input);
  const trustNarrativeLead =
    input.signals.trustSignalStrength === 'high' && input.signals.confidence === 'medium';

  if (specialtyFocus) {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' The contact setup is email-only, so the wording stays especially narrow.'
        : contactSurface === 'phone_only'
          ? ' The contact setup is phone-only, so the wording stays especially narrow.'
          : '';

    return `The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: ${specialtyFocus} still needs a clearer next step.${contactSuffix}`;
  }

  if (tone === 'bilingual') {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' The contact setup is email-only, so the wording stays especially narrow.'
        : contactSurface === 'phone_only'
          ? ' The contact setup is phone-only, so the wording stays especially narrow.'
          : '';

    return `The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: the bilingual presentation still needs a clearer next step.${contactSuffix}`;
  }

  if (tone === 'english_led') {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' The contact setup is email-only, so the wording stays especially narrow.'
        : contactSurface === 'phone_only'
          ? ' The contact setup is phone-only, so the wording stays especially narrow.'
          : '';

    return `The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: the English-led presentation still needs a clearer next step.${contactSuffix}`;
  }

  if (hasThinDirectBooking(input)) {
    const contactSuffix =
      contactSurface === 'email_only'
        ? ' The contact setup is email-only, so the wording stays especially narrow.'
        : contactSurface === 'phone_only'
          ? ' The contact setup is phone-only, so the wording stays especially narrow.'
          : contactSurface === 'none'
            ? ' No clear contact path stands out, so the wording stays especially narrow.'
            : '';

    return `The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: the site already offers a direct booking path, while the surrounding contact surface still feels thinner than the strongest leads.${contactSuffix}`;
  }

  if (contactSurface === 'email_only') {
    return 'The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: the email-only contact setup still needs a clearer next step.';
  }

  if (contactSurface === 'phone_only') {
    return 'The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: the phone-only contact setup still needs a clearer next step.';
  }

  if (hasIndirectBooking && hasMediumTrust) {
    return 'The draft stays narrower than the strongest good-lead angle. It treats the practice as commercially valid, but avoids overselling the case by focusing on one believable point: interested visitors may still be working a bit too hard to reach the next step.';
  }

  if (trustNarrativeLead) {
    return 'The draft keeps the tone grounded because the lead has strong trust material, but it is still not quite rich enough to justify the strongest generic send-ready angle. That makes the message more specific and believable than a flat booking pitch.';
  }

  if (strongTrustNarrative) {
    return 'The draft keeps the tone grounded because the lead has a strong trust story, but it is still not quite rich enough to justify the strongest generic send-ready angle. That makes the message more specific and believable than a flat booking pitch.';
  }

  return 'The draft keeps the tone grounded because the lead looks valid but not especially rich. That makes the message more believable than treating it like a top-tier trust-led case.';
};

const buildMediumValidEvidence = (input: GenerateOutreachInput): string[] => {
  const { signals, snapshot, audit } = input;
  const evidence: string[] = [];
  const specialtyFocus = detectSpecialtyFocus(getSnapshotText(snapshot));
  const tone = detectLanguageTone(getSnapshotText(snapshot));
  const contactSurface = describeContactSurface(input);
  const strongTrustNarrative = hasStrongTrustNarrative(input);
  const trustNarrativeLead =
    signals.trustSignalStrength === 'high' && signals.confidence === 'medium';

  if (signals.localRelevance === 'high_match') {
    evidence.push('The practice is still clearly anchored in the target local market.');
  }

  if (signals.contactClarity !== 'low') {
    evidence.push('The contact surface is usable enough to support a credible outreach angle.');
  }

  if (signals.bookingPresence === 'indirect') {
    evidence.push(
      'Booking intent is visible, but the path to action is less direct than a stronger send candidate.',
    );
  }

  if (signals.trustSignalStrength === 'medium') {
    evidence.push(
      'Trust cues are present, but the site does not carry the same depth of trust signaling as the strongest local leads.',
    );
  }

  if (hasThinDirectBooking(input) && snapshot.bookingLinks[0]) {
    evidence.push(`A direct booking path is already present: ${snapshot.bookingLinks[0]}`);
  }

  if (specialtyFocus) {
    evidence.push(`A visible specialty focus is present in the site copy: ${specialtyFocus}.`);
  }

  if (trustNarrativeLead) {
    evidence.push('The audit surfaces a family-led, long-standing positioning, which is a meaningful trust asset.');
  } else if (strongTrustNarrative) {
    evidence.push('The audit surfaces a family-led, long-standing positioning, which is a meaningful trust asset.');
  }

  if (tone === 'bilingual') {
    evidence.push('The site uses both German and English, which broadens accessibility.');
  } else if (tone === 'english_led') {
    evidence.push('The site is English-led while still naming the local market explicitly.');
  }

  if (contactSurface === 'email_only') {
    evidence.push('An email path stands out, but no phone path stands out.');
  } else if (contactSurface === 'phone_only') {
    evidence.push('A phone path stands out, but no email path stands out.');
  }

  if (audit.opportunities.length > 0) {
    evidence.push(`Audit opportunity identified: ${audit.opportunities[0]}`);
  }

  return [...new Set(evidence)].slice(0, 5);
};

const buildGoodLeadReasoning = (input: GenerateOutreachInput): string => {
  const { snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const contactSurface = describeContactSurface(input);
  const strongTrustNarrative = hasStrongTrustNarrative(input);

  if (
    specialtyFocus &&
    strongTrustNarrative
  ) {
    return `The draft uses a specific, credible angle: the practice combines ${specialtyFocus} with strong trust-building material, but that strength is described more than it is converted into booking momentum. That makes the message more specific and more commercially relevant than a generic booking-friction pitch.`;
  }

  if (strongTrustNarrative) {
    return 'The draft uses a specific, credible angle: the practice has strong trust-building material, but that strength is described more than it is converted into booking momentum. That makes the message more specific and more commercially relevant than a generic booking-friction pitch.';
  }

  if (specialtyFocus) {
    return `The draft uses a specific, credible angle: the practice makes its ${specialtyFocus} visible, but the message still needs a clearer booking push.`;
  }

  if (tone === 'bilingual') {
    return 'The draft uses a specific, credible angle: the site is accessible in both German and English, but the message still needs a clearer booking push.';
  }

  if (tone === 'english_led') {
    return 'The draft uses a specific, credible angle: the site is easy to read in English, but the message still needs a clearer booking push.';
  }

  if (contactSurface === 'email_only') {
    return 'The draft uses a specific, credible angle: the contact path is email-only, so the message stays focused on one simple next step.';
  }

  if (contactSurface === 'phone_only') {
    return 'The draft uses a specific, credible angle: the contact path is phone-only, so the message stays focused on one simple next step.';
  }

  return 'The draft is built around a real commercial angle: existing credibility appears stronger than the page push toward action. That makes the outreach feel more grounded than a generic performance or marketing message.';
};

const buildGoodLeadEvidence = (input: GenerateOutreachInput): string[] => {
  const { snapshot, audit } = input;
  const combinedText = getSnapshotText(snapshot);
  const evidence: string[] = [];
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const contactSurface = describeContactSurface(input);
  const strongTrustNarrative = hasStrongTrustNarrative(input);

  if (snapshot.bookingLinks[0]) {
    evidence.push(`A direct booking path is already present: ${snapshot.bookingLinks[0]}`);
  }

  if (strongTrustNarrative) {
    evidence.push('The audit surfaces a family-led, long-standing positioning, which is a meaningful trust asset.');
  }

  if (
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(combinedText)
  ) {
    evidence.push('The messaging strongly emphasizes reassurance, comfort, and patient-friendly care.');
  }

  if (specialtyFocus) {
    evidence.push(`A visible specialty focus is present in the page messaging: ${specialtyFocus}.`);
  }

  if (tone === 'bilingual') {
    evidence.push('The site uses both German and English, which broadens accessibility for local visitors.');
  } else if (tone === 'english_led') {
    evidence.push('The site is English-led while still naming the local market explicitly.');
  }

  if (contactSurface === 'email_only') {
    evidence.push('An email path stands out, but no phone path stands out.');
  } else if (contactSurface === 'phone_only') {
    evidence.push('A phone path stands out, but no email path stands out.');
  }

  if (audit.opportunities.length > 0) {
    evidence.push(`Audit opportunity identified: ${audit.opportunities[0]}`);
  }

  return [...new Set(evidence)].slice(0, 5);
};

const buildGeneralSendFitReason = (): string => {
  return 'The lead is aligned enough with the current outreach strategy to justify a send-ready draft built around one clear conversion angle.';
};

const buildGeneralSendBestAngle = (): string => {
  return 'Lead with booking-path clarity and reduced friction at the point where a visitor is ready to act.';
};

const buildGeneralSendSubject = (input: GenerateOutreachInput): string => {
  const { lead } = input;
  return pickVariant(
    [
      `A quick thought on booking flow at ${lead.companyName}`,
      `One booking-flow idea for ${lead.companyName}`,
      `A quick conversion thought for ${lead.companyName}`,
    ],
    input,
  );
};

const buildGeneralSendBody = (input: GenerateOutreachInput): string => {
  const { lead } = input;

  return pickVariant(
    [
      `Hi,

I took a quick look at ${lead.companyName}, and one thing stood out: the path from interest to booking may be doing a little more work than it needs to.

When someone is already ready to act, even a small amount of extra friction can be enough to slow that moment down.

If helpful, I can share a short perspective on where that path may be less direct than it could be.

Best,
[Your Name]`,
      `Hi,

I spent a bit of time on ${lead.companyName}, and the part that stood out most was the path from interest into booking.

When that step feels even slightly heavier than it should, some otherwise ready visitors end up waiting instead of acting.

If helpful, I can share a short perspective on where that path may be less direct than it could be.

Best,
[Your Name]`,
    ],
    input,
  );
};

const buildGeneralSendReasoning = (): string => {
  return 'The draft stays focused on one credible angle - booking-path clarity - rather than broad marketing language. That makes it more specific, more believable, and more likely to feel relevant to the recipient.';
};

const buildGeneralSendEvidence = (input: GenerateOutreachInput): string[] => {
  const { signals, snapshot, audit } = input;
  const evidence: string[] = [];

  if (signals.bookingPresence === 'indirect') {
    evidence.push(
      'The site shows booking intent, but the journey to action appears less direct than it could be.',
    );
  }

  if (signals.contactClarity !== 'low') {
    evidence.push(
      'Users appear to have visible ways to contact the business and move toward action.',
    );
  }

  if (signals.trustSignalStrength === 'high') {
    evidence.push(
      'The site already communicates strong trust cues, so the stronger outreach angle is conversion clarity rather than credibility.',
    );
  }

  if (snapshot.pageTitle) {
    evidence.push(
      `The page title supports the overall positioning visible on the site: ${snapshot.pageTitle}`,
    );
  }

  if (audit.opportunities.length > 0) {
    evidence.push(
      `The audit highlights a conversion-related opportunity: ${audit.opportunities[0]}.`,
    );
  }

  return [...new Set(evidence)].slice(0, 5);
};

const countSpecialtyMarkers = (text: string): number => {
  const markers = [
    /implant(?:e|ologie|ology|at)/i,
    /oral surgery|oralchir|oralchirurgie|weisheitszahn/i,
    /invisalign|aligner/i,
    /\bendo(?:\s|$|-|studio|praxis)|endodont|endodontie|endodontics|wurzelbehandlung|wurzelkanal|root canal/i,
    /kinderzahn|kinderzahnarzt|pediatric dentistry|children'?s dentistry|kids dentistry/i,
    /parodont/i,
  ];

  return markers.reduce((count, pattern) => (pattern.test(text) ? count + 1 : count), 0);
};

const isBrandHeavyMultiSpecialtyReviewLead = (
  input: GenerateOutreachInput,
): boolean => {
  const text = getSnapshotText(input.snapshot);
  const contactSurface = describeContactSurface(input);
  const brandFootprint =
    /zahnzentrum|zahnspezialisten|zahnarztzentrum|alldent|all dent|praxisnetz|dental group|medical board|standortleitung/i.test(
      text,
    );
  const localFooting =
    /berlin|mitte|charlottenburg|prenzlauer berg|wilmersdorf|friedrichstrasse|friedrichstraße/i.test(
      text,
    );

  return (
    countSpecialtyMarkers(text) >= 2 &&
    brandFootprint &&
    localFooting &&
    contactSurface === 'both' &&
    input.signals.bookingPresence === 'direct' &&
    input.signals.trustSignalStrength !== 'high'
  );
};

const buildBrandHeavyMultiSpecialtyReviewFitReason = (): string => {
  return 'The lead is commercially valid, but the brand-heavy multi-specialty presentation still needs a human check before anything is sent.';
};

const buildBrandHeavyMultiSpecialtyReviewSubject = (
  input: GenerateOutreachInput,
): string => {
  return `Quick check on multi-specialty booking at ${input.lead.companyName}`;
};

const buildBrandHeavyMultiSpecialtyReviewBestAngle = (): string => {
  return 'Lead with the multi-specialty practice and a simpler path from intent to action.';
};

const buildBrandHeavyMultiSpecialtyReviewBody = (
  input: GenerateOutreachInput,
): string => {
  return pickVariant(
    [
      `Hi,

I came across ${input.lead.companyName}, and the site reads as a brand-heavy multi-specialty practice with a direct booking path.

That makes it worth reviewing, but I would still want a human to confirm the angle before anything is sent.

If useful, I can share a short perspective on whether the angle is worth pursuing.

Best,
[Your Name]`,
      `Hi,

I took a look at ${input.lead.companyName}. The site clearly reads as a multi-specialty practice with real booking access, but the brand-heavy presentation still feels like something a human should check.

That keeps it in review territory instead of a send-ready draft.

If useful, I can share a short perspective on whether the angle is worth pursuing.

Best,
[Your Name]`,
    ],
    input,
  );
};

const buildBrandHeavyMultiSpecialtyReviewReasoning = (): string => {
  return 'The lead is directionally relevant, but the brand-heavy multi-specialty presentation still needs a human to confirm the angle and wording before anything is sent.';
};

const buildBrandHeavyMultiSpecialtyReviewEvidence = (
  input: GenerateOutreachInput,
): string[] => {
  const evidence = [
    'The site reads as a brand-heavy multi-specialty practice with direct booking access.',
    'The business presents a clear local footprint rather than an anonymous generic web presence.',
  ];

  if (input.snapshot.bookingLinks[0]) {
    evidence.push(`A direct booking path is already present: ${input.snapshot.bookingLinks[0]}`);
  }

  if (describeContactSurface(input) === 'both') {
    evidence.push('Email and phone contact paths are both visible on the page.');
  }

  return [...new Set(evidence)].slice(0, 5);
};

const isMediumValidLead = (input: GenerateOutreachInput): boolean => {
  const { signals } = input;
  const strongTrustNarrative = hasStrongTrustNarrative(input);

  if (signals.outreachFit !== 'good') {
    return false;
  }

  if (strongTrustNarrative && signals.trustSignalStrength === 'high') {
    return false;
  }

  return (
    signals.confidence === 'medium' ||
    signals.trustSignalStrength === 'medium' ||
    signals.contactClarity === 'medium' ||
    signals.bookingPresence === 'indirect'
  );
};

export class MockOutreachGenerator implements OutreachGenerator {
  async generate(
    input: GenerateOutreachInput,
  ): Promise<GeneratedOutreachDraft> {
    const { signals, snapshot } = input;

    if (snapshot.isPlaceholderContent) {
      return buildPlaceholderOutreach(input);
    }

    if (isBorderlineScaledLocalReviewLead(input)) {
      return {
        recommendation: 'review',
        fitReason: buildBorderlineScaledLocalReviewFitReason(),
        bestAngle: buildBorderlineScaledLocalReviewBestAngle(),
        subject: buildBorderlineScaledLocalReviewSubject(input),
        body: buildBorderlineScaledLocalReviewBody(input),
        reasoning: buildBorderlineScaledLocalReviewReasoning(),
        evidence: buildBorderlineScaledLocalReviewEvidence(input),
      };
    }

    const isPoorFit =
      signals.outreachFit === 'poor' ||
      signals.localRelevance === 'low_match';

    if (isPoorFit) {
      return {
        recommendation: 'do_not_send',
        fitReason: buildDoNotSendFitReason(input),
        bestAngle: buildDoNotSendBestAngle(input),
        subject: null,
        body: null,
        reasoning: buildDoNotSendReasoning(input),
        evidence: buildDoNotSendEvidence(input),
      };
    }

    if (isBrandHeavyMultiSpecialtyReviewLead(input)) {
      return {
        recommendation: 'review',
        fitReason: buildBrandHeavyMultiSpecialtyReviewFitReason(),
        bestAngle: buildBrandHeavyMultiSpecialtyReviewBestAngle(),
        subject: buildBrandHeavyMultiSpecialtyReviewSubject(input),
        body: buildBrandHeavyMultiSpecialtyReviewBody(input),
        reasoning: buildBrandHeavyMultiSpecialtyReviewReasoning(),
        evidence: buildBrandHeavyMultiSpecialtyReviewEvidence(input),
      };
    }

    if (signals.outreachFit === 'uncertain') {
      return {
        recommendation: 'review',
        fitReason: buildReviewFitReason(input),
        bestAngle: buildReviewBestAngle(input),
        subject: buildReviewSubject(input),
        body: buildReviewBody(input),
        reasoning: buildReviewReasoning(input),
        evidence: buildReviewEvidence(input),
      };
    }

    if (signals.outreachFit === 'good') {
      if (isMediumValidLead(input)) {
        return {
          recommendation: 'send',
          fitReason: buildMediumValidFitReason(input),
          bestAngle: buildMediumValidBestAngle(input),
          subject: buildMediumValidSubject(input),
          body: buildMediumValidBody(input),
          reasoning: buildMediumValidReasoning(input),
          evidence: buildMediumValidEvidence(input),
        };
      }

      return {
        recommendation: 'send',
        fitReason: buildGoodLeadFitReason(input),
        bestAngle: buildGoodLeadBestAngle(input),
        subject: buildGoodLeadSubject(input),
        body: buildGoodLeadBody(input),
        reasoning: buildGoodLeadReasoning(input),
        evidence: buildGoodLeadEvidence(input),
      };
    }

    return {
      recommendation: 'send',
      fitReason: buildGeneralSendFitReason(),
      bestAngle: buildGeneralSendBestAngle(),
      subject: buildGeneralSendSubject(input),
      body: buildGeneralSendBody(input),
      reasoning: buildGeneralSendReasoning(),
      evidence: buildGeneralSendEvidence(input),
    };
  }
}

