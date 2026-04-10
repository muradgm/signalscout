import type {
  AuditGenerator,
  GenerateAuditInput,
  GeneratedAuditDraft,
} from '@signalscout/core';

const buildPlaceholderAudit = (
  input: GenerateAuditInput,
): GeneratedAuditDraft => {
  const { lead, snapshot } = input;
  const visibleText = getSnapshotText(snapshot);

  return {
    summary: `${lead.companyName} does not currently show enough real website content to support a meaningful business audit. The page appears to be placeholder or inactive rather than a functioning clinic website.`,
    strengths: [],
    opportunities: [
      'The website should first be replaced with real business content before conversion or outreach analysis is attempted.',
    ],
    opportunityDetails: [
      'At the moment, there is not enough visible content to assess booking flow, trust structure, service clarity, or conversion quality in a credible way.',
    ],
    risks: [
      'Any outreach based on the current site would be poorly grounded.',
      'The site appears inactive or placeholder-like, which makes lead evaluation unreliable.',
      'Minimal site content increases the risk of false conclusions.',
    ],
    recommendedAngle:
      'Do not pursue outreach from the current site state. Revisit this lead only if the website goes live with real business content.',
    confidenceNote:
      'Confidence is low because the visible page content appears placeholder-like and does not provide a reliable basis for normal website assessment.',
    quickWins: [
      'Replace placeholder or inactive content with real service and location content.',
      'Add a visible booking or contact path before re-evaluating the lead.',
    ],
    outreachHook:
      'This lead is not ready for outreach until the website shows real business content and a clear conversion path.',
    evidence: [
      ...(snapshot.pageTitle
        ? [`Page title suggests placeholder content: ${snapshot.pageTitle}`]
        : []),
      /coming soon|under construction/i.test(visibleText)
        ? 'Visible page content says the site is still under construction or coming soon.'
        : 'Visible page content is too limited to support a meaningful evaluation.',
      ...(snapshot.contactInfo.emails.length > 0
        ? [`Only limited contact content was visible, including: ${snapshot.contactInfo.emails[0]}`]
        : []),
    ],
  };
};

const mentionsLongTradition = (text: string): boolean => {
  return /seit uber 50 jahren|uber 50 jahren|over 50 years|seit 50 jahren|seit uber 40 jahren|uber 40 jahren|over 40 years|more than 40 years/i.test(
    text,
  );
};

const mentionsFamilyPositioning = (text: string): boolean => {
  return /als vater und sohn|father and son|family[- ]led|family practice|family care|family-friendly|families|familien|familiengefuhrt|familiengefuhrte|familienzahnarzt/i.test(
    text,
  );
};

const mentionsComfortReassurance = (text: string): boolean => {
  return /wohlbefinden|angstpatienten|schonende|schmerzfreie|kinderecke|aquarium/i.test(
    text,
  );
};

const getSnapshotText = (
  snapshot: GenerateAuditInput['snapshot'],
): string => {
  return `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
};

const normalizeLocationText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u');
};

const getRecordedLocationTerms = (lead: GenerateAuditInput['lead']): string[] => {
  const normalized = normalizeLocationText(lead.location ?? '');

  if (!normalized) {
    return [];
  }

  const terms = new Set<string>([normalized]);
  const firstToken = normalized.split(/\s+/)[0];

  if (firstToken && firstToken.length >= 4) {
    terms.add(firstToken);
  }

  return [...terms];
};

const hasRecordedLocationMention = (input: GenerateAuditInput): boolean => {
  const normalizedText = normalizeLocationText(getSnapshotText(input.snapshot));
  const normalizedAddresses = normalizeLocationText(
    input.snapshot.contactInfo.addresses.join(' '),
  );
  const haystack = `${normalizedText} ${normalizedAddresses}`;

  return getRecordedLocationTerms(input.lead).some((term) => haystack.includes(term));
};

const hasLocationMismatchRisk = (input: GenerateAuditInput): boolean => {
  return (
    input.signals.localRelevance === 'low_match' ||
    (input.signals.outreachFit === 'uncertain' && !hasRecordedLocationMention(input))
  );
};

const detectWeakContactSurface = (
  input: GenerateAuditInput,
): 'email_only' | 'phone_only' | 'address_only' | 'thin_mixed' | null => {
  if (input.signals.contactClarity !== 'medium') {
    return null;
  }

  const { emails, phones, addresses } = input.snapshot.contactInfo;
  const contactChannels = [emails.length > 0, phones.length > 0, addresses.length > 0].filter(Boolean)
    .length;

  if (emails.length > 0 && phones.length === 0) {
    return 'email_only';
  }

  if (phones.length > 0 && emails.length === 0) {
    return 'phone_only';
  }

  if (addresses.length > 0 && emails.length === 0 && phones.length === 0) {
    return 'address_only';
  }

  if (contactChannels <= 2 && input.signals.bookingPresence !== 'direct') {
    return 'thin_mixed';
  }

  return null;
};

const buildWeakContactSummaryClause = (
  weakContactSurface: ReturnType<typeof detectWeakContactSurface>,
): string => {
  switch (weakContactSurface) {
    case 'email_only':
      return ' The contact path still leans too heavily on email, which makes the opportunity feel less immediate than the strongest leads.';
    case 'phone_only':
      return ' The contact path still leans too heavily on phone-only follow-up, which makes the opportunity feel narrower than the strongest leads.';
    case 'address_only':
      return ' The visible contact path is unusually thin, which weakens confidence in the next-step experience.';
    case 'thin_mixed':
      return ' The visible contact options are still thinner and less guided than the strongest leads.';
    default:
      return '';
  }
};

const buildWeakContactOpportunity = (
  weakContactSurface: ReturnType<typeof detectWeakContactSurface>,
): string | null => {
  switch (weakContactSurface) {
    case 'email_only':
      return 'The site relies too heavily on email as the main response path.';
    case 'phone_only':
      return 'The site relies too heavily on phone-only follow-up as the main response path.';
    case 'address_only':
      return 'The site does not surface enough clear contact options for an otherwise valid lead.';
    case 'thin_mixed':
      return 'The contact surface is still thinner and less directed than the strongest leads.';
    default:
      return null;
  }
};

const buildWeakContactDetail = (
  weakContactSurface: ReturnType<typeof detectWeakContactSurface>,
): string | null => {
  switch (weakContactSurface) {
    case 'email_only':
      return 'Visitors mostly appear to be pushed toward email follow-up. That can still work, but it weakens urgency and makes the route into action feel slower than it should.';
    case 'phone_only':
      return 'Visitors mostly appear to be pushed toward phone follow-up. That can still convert, but it narrows the action path and makes the experience feel less flexible than the strongest leads.';
    case 'address_only':
      return 'The business may be real, but the contact surface is too thin to support a strong conversion read without more visible ways to act.';
    case 'thin_mixed':
      return 'There is enough contact information to keep the lead valid, but the main response path still feels thinner and less guided than the strongest local sites.';
    default:
      return null;
  }
};

const buildWeakContactEvidence = (
  weakContactSurface: ReturnType<typeof detectWeakContactSurface>,
): string | null => {
  switch (weakContactSurface) {
    case 'email_only':
      return 'Email is visible, but no phone path stands out in the current site content.';
    case 'phone_only':
      return 'A phone path is visible, but no email path stands out in the current site content.';
    case 'address_only':
      return 'An address is visible, but no clear phone or email path stands out in the current site content.';
    case 'thin_mixed':
      return 'The contact options are usable, but they still look thinner and less guided than the strongest benchmark leads.';
    default:
      return null;
  }
};

const hasEnglishCommercialCopy = (text: string): boolean => {
  return /book online|request appointment|request consultation|online booking|online appointment|friendly dental care|dental care in|patient comfort|modern technology|calm support|calm patient|team directly|call our team/i.test(
    text,
  );
};

const hasGermanPracticeCopy = (text: string): boolean => {
  return /zahnarzt|zahnarztpraxis|praxis|termin|patienten|behandlung|angstpatienten|familien|familienfreundlich|kinderecke|kinderzahnarzt|implantologie|implant|endodont|oralchir|aligner|wurzelbehandlung/i.test(
    text,
  );
};

const detectLanguageTone = (
  text: string,
): 'bilingual' | 'english_led' | null => {
  const hasEnglish = hasEnglishCommercialCopy(text);
  const hasGerman = hasGermanPracticeCopy(text);

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

const detectNetworkStyle = (text: string): boolean => {
  return /praxisnetz|zahnzentrum|standortleitung|geschaeftsleitung|gesch[aä]ftsleitung|medical board|more than \d+ locations|over \d+ locations|locations across germany|nationwide|multi[- ]location|network/i.test(
    text,
  );
};

const describeBookingPath = (
  bookingPresence: GenerateAuditInput['signals']['bookingPresence'],
): string => {
  if (bookingPresence === 'direct') {
    return 'a direct booking path';
  }

  if (bookingPresence === 'indirect') {
    return 'visible booking intent with a softer action path';
  }

  return 'no clear booking path';
};

const hasCompleteContactSurface = (input: GenerateAuditInput): boolean => {
  return input.snapshot.contactInfo.emails.length > 0 && input.snapshot.contactInfo.phones.length > 0;
};

const hasNoLeadLevelContactSurface = (input: GenerateAuditInput): boolean => {
  return input.snapshot.contactInfo.emails.length === 0 && input.snapshot.contactInfo.phones.length === 0;
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

const detectBrandHeavyMultiSpecialtyPresentation = (text: string): boolean => {
  return /zahnzentrum|zahnspezialisten|zahnarztzentrum|alldent|all dent|praxisnetz|dental group|medical board|standortleitung/i.test(
    text,
  );
};

const buildGoodLeadSummary = (input: GenerateAuditInput): string => {
  const { lead, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const tone = detectLanguageTone(combinedText);
  const bookingPhrase = describeBookingPath(input.signals.bookingPresence);
  const weakContactSurface = detectWeakContactSurface(input);

  const hasTradition = mentionsLongTradition(combinedText);
  const hasFamily = mentionsFamilyPositioning(combinedText);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const toneClause =
    tone === 'bilingual'
      ? ' The site also uses bilingual German/English messaging, which broadens accessibility.'
      : tone === 'english_led'
        ? ' The site uses English-led messaging while still naming the local market clearly.'
        : '';

  if (hasTradition || hasFamily) {
    const specialtyClause = specialtyFocus
      ? ` The site also makes its ${specialtyFocus} positioning clear, which strengthens the commercial angle.`
      : '';

    return `${lead.companyName} has a credible local presence with ${bookingPhrase} and strong trust foundations. Its family-led, long-standing positioning is a real asset, but that trust is described more than it is converted into a decisive booking case.${specialtyClause}${toneClause}`;
  }

  if (specialtyFocus) {
    return `${lead.companyName} has a credible local presence with ${bookingPhrase} and a clear ${specialtyFocus} positioning. The strongest commercial opportunity is to turn that specialist credibility into a more decisive reason to book now.${toneClause}${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (
    input.signals.trustSignalStrength === 'medium' ||
    input.signals.contactClarity === 'medium'
  ) {
    return `${lead.companyName} has a commercially interesting local presence with ${bookingPhrase}, but the site still feels rough around the edges and more workmanlike than the strongest leads. The main opportunity is to turn that usable base into a cleaner, more decisive booking case.${toneClause}${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (tone === 'bilingual') {
    return `${lead.companyName} has a credible local presence with ${bookingPhrase} and bilingual German/English messaging. The site is easy to understand, but it still needs a sharper reason to book now.${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (tone === 'english_led') {
    return `${lead.companyName} has a credible local presence with ${bookingPhrase} and English-led messaging. The site is accessible, but it could turn that clarity into a more decisive booking case.${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  return `${lead.companyName} has a credible local presence with ${bookingPhrase} and clear contact options. The strongest commercial opportunity is less about adding trust and more about turning existing credibility into a more decisive conversion experience.${buildWeakContactSummaryClause(weakContactSurface)}`;
};

const buildGoodLeadStrengths = (input: GenerateAuditInput): string[] => {
  const { snapshot, signals } = input;
  const combinedText = getSnapshotText(snapshot);
  const strengths: string[] = [];
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);

  if (signals.localRelevance === 'high_match') {
    strengths.push('The site is clearly anchored to the local market.');
  }

  if (signals.bookingPresence === 'direct') {
    strengths.push('Direct booking is already available.');
  } else if (signals.bookingPresence === 'indirect') {
    strengths.push('Visitors can already see booking intent, even if the route into action is softer than it should be.');
  }

  if (signals.contactClarity === 'high') {
    strengths.push('Contact options are clear and easy to find.');
  } else if (signals.contactClarity === 'medium') {
    strengths.push('The site still gives visitors workable contact options.');
  }

  if (mentionsLongTradition(combinedText)) {
    strengths.push('The site communicates a long-standing local presence, which is a strong trust asset.');
  }

  if (mentionsFamilyPositioning(combinedText)) {
    strengths.push('The family-led positioning adds warmth and credibility.');
  }

  if (mentionsComfortReassurance(combinedText)) {
    strengths.push('The site puts real emphasis on patient comfort and reassurance.');
  }

  if (tone === 'bilingual') {
    strengths.push(
      'The site combines German and English messaging, which broadens accessibility without losing local grounding.',
    );
  } else if (tone === 'english_led') {
    strengths.push(
      'The site is easy to understand in English while still staying locally anchored.',
    );
  }

  if (specialtyFocus) {
    strengths.push(
      `The site makes its ${specialtyFocus} visible, which creates a clearer and more specific commercial angle.`,
    );
  }

  return [...new Set(strengths)].slice(0, 5);
};

const buildGoodLeadOpportunities = (input: GenerateAuditInput): string[] => {
  const { snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const hasTrustPositioning =
    mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText);
  const hasComfortPositioning = mentionsComfortReassurance(combinedText);
  const weakContactSurface = detectWeakContactSurface(input);
  const opportunities: string[] = [];

  if (hasTrustPositioning || hasComfortPositioning) {
    opportunities.push(
      'The site builds trust well, but it does not turn that trust into a decisive enough reason to book.',
    );
  } else {
    opportunities.push('The site could guide visitors from confidence to booking more decisively.');
  }

  const weakContactOpportunity = buildWeakContactOpportunity(weakContactSurface);
  if (weakContactOpportunity) {
    opportunities.push(weakContactOpportunity);
  }

  return [...new Set(opportunities)].slice(0, 3);
};

const buildGoodLeadOpportunityDetails = (
  input: GenerateAuditInput,
): string[] => {
  const { snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const details: string[] = [];
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const weakContactSurface = detectWeakContactSurface(input);

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    details.push(
      'The practice has unusually strong trust material — long local presence, family continuity, and visible patient reassurance — but much of that value sits in explanation rather than in a sharper case for booking now.',
    );
  }

  if (mentionsComfortReassurance(combinedText)) {
    details.push(
      'The site does a good job making patients feel safe, especially those who may be nervous. The opportunity is to carry that reassurance more directly into the booking decision, so comfort leads to action rather than just positive perception.',
    );
  }

  if (specialtyFocus) {
    details.push(
      `The ${specialtyFocus} positioning is visible enough to matter commercially. The next step is to make that specialist credibility work harder at the point where a visitor is deciding whether to book.`,
    );
  }

  const weakContactDetail = buildWeakContactDetail(weakContactSurface);
  if (weakContactDetail) {
    details.push(weakContactDetail);
  }

  if (tone === 'bilingual') {
    details.push(
      'The bilingual presentation broadens reach, but it should still be tied more directly to the booking decision so accessibility turns into action.',
    );
  } else if (tone === 'english_led') {
    details.push(
      'The English-led presentation lowers friction, but it still needs a sharper call to action to make the next step feel immediate.',
    );
  }

  if (details.length === 0) {
    details.push(
      'Visitors can likely understand and trust the practice, but the page could do more to turn that confidence into a clearer next step.',
    );
  }

  return [...new Set(details)].slice(0, 3);
};

const buildGoodLeadRisks = (input: GenerateAuditInput): string[] => {
  const { lead } = input;
  const risks: string[] = [];

  if (lead.completeness !== 'complete') {
    risks.push('Incomplete lead metadata reduces targeting precision.');
  }

  return risks;
};

const buildGoodLeadRecommendedAngle = (input: GenerateAuditInput): string => {
  const { snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const tone = detectLanguageTone(combinedText);

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    return 'Lead with the gap between strong trust-building and decisive booking momentum: the site already feels credible, but it could convert that trust into action more deliberately.';
  }

  if (tone === 'bilingual') {
    return 'Lead with how the bilingual presentation could be turned into a clearer and less hesitant booking step.';
  }

  if (tone === 'english_led') {
    return 'Lead with the English-led clarity, then tighten the next step so action feels more immediate.';
  }

  return 'Lead with how existing credibility could be turned into a sharper, more decisive path from reassurance to booking.';
};

const buildGoodLeadConfidenceNote = (input: GenerateAuditInput): string => {
  const { lead } = input;

  if (lead.completeness !== 'complete') {
    return 'Confidence is medium: the website content is strong enough for a grounded review, though incomplete lead metadata still limits precision slightly.';
  }

  return 'Confidence is medium to high: the website provides enough real content to support a grounded commercial assessment.';
};

const buildGoodLeadQuickWins = (input: GenerateAuditInput): string[] => {
  const { snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const quickWins: string[] = [
    'Make the primary booking action more prominent above the fold.',
    'Turn the main trust claim into a clearer reason to book now.',
  ];
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const weakContactSurface = detectWeakContactSurface(input);

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    quickWins.push('Use the long-standing family-led positioning directly beside the main booking call to action.');
  }

  if (mentionsComfortReassurance(combinedText)) {
    quickWins.push('Connect reassurance messaging more explicitly to the next booking step.');
  }

  if (specialtyFocus) {
    quickWins.push(`Place the ${specialtyFocus} message closer to the primary booking action.`);
  }

  if (tone === 'bilingual') {
    quickWins.push('Use the bilingual presentation to make the primary booking action impossible to miss.');
  } else if (tone === 'english_led') {
    quickWins.push('Pair the English-led explanation with one very clear booking call to action.');
  }

  if (weakContactSurface === 'email_only') {
    quickWins.push('Add a phone option or stronger immediate-response path beside email.');
  } else if (weakContactSurface === 'phone_only') {
    quickWins.push('Add a visible email or written inquiry path beside the phone option.');
  }

  return [...new Set(quickWins)].slice(0, 3);
};

const buildGoodLeadOutreachHook = (input: GenerateAuditInput): string => {
  const { snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    return 'The site already feels trustworthy and established; the opportunity is to convert that credibility into a more decisive booking moment.';
  }

  if (tone === 'bilingual') {
    return 'The site already feels easy to approach in both German and English, but the booking case could be more decisive.';
  }

  if (tone === 'english_led') {
    return 'The site is easy to read in English, but it could convert that clarity into a stronger booking case.';
  }

  if (specialtyFocus) {
    return `The site already signals ${specialtyFocus}, but that specialist credibility could be turned into a much clearer booking case.`;
  }

  return 'The site already has credibility, but the conversion path could make the next step feel more obvious and immediate.';
};

const buildGoodLeadEvidence = (input: GenerateAuditInput): string[] => {
  const { snapshot, signals } = input;
  const combinedText = getSnapshotText(snapshot);
  const evidence: string[] = [];
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const weakContactSurface = detectWeakContactSurface(input);

  if (signals.bookingPresence === 'direct' && snapshot.bookingLinks[0]) {
    evidence.push(`Direct booking link found: ${snapshot.bookingLinks[0]}`);
  } else if (signals.bookingPresence === 'indirect') {
    evidence.push('Booking intent is visible, but the path to action still feels softer than it should.');
  }

  if (signals.contactClarity === 'high') {
    evidence.push('Contact options are clearly visible on the page.');
  } else if (signals.contactClarity === 'medium') {
    evidence.push('The page still gives visitors a workable contact path, though it is not especially focused.');
  }

  const weakContactEvidence = buildWeakContactEvidence(weakContactSurface);
  if (weakContactEvidence) {
    evidence.push(weakContactEvidence);
  }

  if (signals.localRelevance === 'high_match') {
    evidence.push('The site strongly reflects the local market context.');
  }

  if (mentionsLongTradition(combinedText)) {
    evidence.push('A 50+ year local tradition is explicitly mentioned.');
  }

  if (mentionsFamilyPositioning(combinedText)) {
    evidence.push('The site explicitly presents the practice in family-led terms.');
  }

  if (mentionsComfortReassurance(combinedText)) {
    evidence.push('The messaging repeatedly emphasizes patient comfort, reassurance, and low-stress care.');
  }

  if (specialtyFocus) {
    evidence.push(`A visible specialty focus is present in the page messaging: ${specialtyFocus}.`);
  }

  if (tone === 'bilingual') {
    evidence.push('The site blends German and English messaging, which broadens accessibility for local visitors.');
  } else if (tone === 'english_led') {
    evidence.push('The site is written in English while still naming the local market explicitly.');
  }

  return [...new Set(evidence)].slice(0, 6);
};

const buildGeneralSummary = (input: GenerateAuditInput): string => {
  const { lead, signals, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const hasNetworkStyle = detectNetworkStyle(combinedText);
  const hasBrandLedNetworkCopy = /zahnzentrum|standortleitung|geschaeftsleitung|gesch[aä]ftsleitung|medical board|praxisnetz|alldent/i.test(
    combinedText,
  );

  if (signals.outreachFit === 'poor') {
    if (signals.businessScale === 'large_chain' || hasNetworkStyle) {
      if (hasBrandLedNetworkCopy) {
        return `${lead.companyName} reads as a brand-led multi-site practice rather than a single local practice. While booking intent and credibility are both visible, it is still a weak match for a local conversion-focused outreach angle.`;
      }

      return `${lead.companyName} reads as a large, multi-location dental network rather than a single local practice. While booking intent and credibility are both visible, it is a weak match for a local conversion-focused outreach angle.`;
    }

    if (signals.businessScale === 'multi_location') {
      return `${lead.companyName} reads as a brand-led multi-site practice rather than a single local practice. While booking intent and credibility are both visible, it is still a weak match for a local conversion-focused outreach angle.`;
    }

    if (signals.localRelevance === 'low_match') {
      return `${lead.companyName} has enough visible credibility to be real, but the site does not line up closely enough with the recorded local market to justify a local-practice outreach angle.`;
    }

    return `${lead.companyName} presents a credible online presence, but it is not a strong fit for the current local-practice outreach wedge.`;
  }

  if (signals.bookingPresence === 'indirect') {
    return `${lead.companyName} shows clear booking intent, but the path from interest to action is not especially direct. That likely introduces avoidable friction in the conversion journey.`;
  }

  if (signals.bookingPresence === 'not_detected') {
    return `${lead.companyName} has a visible online presence, but no clear booking path was detected. That gap may be limiting conversion from otherwise interested visitors.`;
  }

  return `${lead.companyName} presents a credible online presence, though the strongest commercial opportunity still needs human review before a sharper recommendation can be made.`;
};

const isValidButThinnerLead = (input: GenerateAuditInput): boolean => {
  const { signals, snapshot } = input;

  if (signals.outreachFit === 'poor') {
    return false;
  }

  if (snapshot.isPlaceholderContent) {
    return false;
  }

  return (
    signals.outreachFit === 'uncertain' ||
    signals.contactClarity === 'medium' ||
    signals.trustSignalStrength === 'medium' ||
    signals.bookingPresence === 'indirect'
  );
};

const buildMediumLeadSummary = (input: GenerateAuditInput): string => {
  const { lead, signals } = input;
  const combinedText = getSnapshotText(input.snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const locationMismatch = hasLocationMismatchRisk(input);
  const weakContactSurface = detectWeakContactSurface(input);
  const brandHeavyMultiSpecialty =
    specialtyFocus === 'multi-specialty practice' &&
    detectBrandHeavyMultiSpecialtyPresentation(combinedText);

  if (locationMismatch) {
    return `${lead.companyName} looks commercially valid, but the visible local market does not line up cleanly with the recorded lead geography. This lead needs manual qualification before a normal local-practice outreach angle can be trusted.${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (brandHeavyMultiSpecialty) {
    return `${lead.companyName} reads as a brand-heavy multi-specialty practice with a visible booking path. It is commercially valid, but the presentation still needs a human check before the opportunity can be translated into a sharper outreach angle.${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    const specialtyClause = specialtyFocus
      ? ` The site also signals ${specialtyFocus}, which makes the lead more commercially specific than a generic local practice.`
      : '';
    const toneClause =
      tone === 'bilingual'
        ? ' The bilingual presentation keeps the lead accessible, but the surrounding contact surface still feels thinner than the strongest leads.'
        : tone === 'english_led'
          ? ' The English-led presentation keeps the lead easy to read, but the surrounding contact surface still feels thinner than the strongest leads.'
          : '';

    return `${lead.companyName} already looks commercially valid, with a direct booking route that is visible on the site. The lead is still worth reviewing, but the surrounding contact surface feels thinner than the strongest leads and needs a clearer next-step message before it feels fully convincing.${specialtyClause}${toneClause}${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (signals.bookingPresence === 'indirect') {
    const specialtyClause = specialtyFocus
      ? ` The site also signals ${specialtyFocus}, which makes the lead more commercially specific than a generic local practice.`
      : '';
    const toneClause =
      tone === 'bilingual'
        ? ' The bilingual presentation makes the lead feel broader and more usable than a plain local listing.'
        : tone === 'english_led'
          ? ' The English-led presentation keeps the lead easy to read even while the action path stays soft.'
          : '';

    return `${lead.companyName} already shows enough trust and intent to be commercially interesting, but the path from reassurance to action still feels more indirect than it should. This is a valid lead, though the site needs a clearer conversion push before the opportunity feels fully convincing.${specialtyClause}${toneClause}${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (specialtyFocus) {
    const toneClause =
      tone === 'bilingual'
        ? ' The bilingual presentation adds accessibility, but the specialist story still needs a sharper next step.'
        : tone === 'english_led'
          ? ' The English-led presentation keeps the lead readable, but the specialist story still needs a clearer next step.'
          : '';

    return `${lead.companyName} looks commercially valid and locally relevant, with a visible ${specialtyFocus} positioning. The site is not thin enough to dismiss, but the specialist story still needs a clearer path into action before the opportunity feels stronger.${toneClause}${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (tone === 'bilingual') {
    return `${lead.companyName} looks commercially valid and locally relevant, with bilingual German/English messaging that makes the site easier to work with. The opportunity is less about fixing a broken site and more about making the existing trust and action path feel sharper and more decisive.${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  if (tone === 'english_led') {
    return `${lead.companyName} looks commercially valid and locally relevant, with English-led messaging that keeps the site easy to understand. The opportunity is less about fixing a broken site and more about making the existing trust and action path feel sharper and more decisive.${buildWeakContactSummaryClause(weakContactSurface)}`;
  }

  return `${lead.companyName} looks commercially valid and locally relevant, but the website story is thinner than the strongest leads. The opportunity is less about fixing a broken site and more about making the existing trust and action path feel sharper and more decisive.${buildWeakContactSummaryClause(weakContactSurface)}`;
};

const buildMediumLeadStrengths = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const strengths: string[] = [];
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const brandHeavyMultiSpecialty =
    specialtyFocus === 'multi-specialty practice' &&
    detectBrandHeavyMultiSpecialtyPresentation(combinedText);

  if (signals.localRelevance === 'high_match') {
    strengths.push('The site is clearly anchored to the local market.');
  } else if (signals.localRelevance === 'partial_match') {
    strengths.push('The site still shows meaningful local relevance even if the positioning is not fully reinforced.');
  }

  if (brandHeavyMultiSpecialty) {
    strengths.push('The site combines multiple specialty cues with a visible booking path.');
  }

  if (signals.bookingPresence === 'direct') {
    strengths.push('A direct booking route is already available.');
  } else if (signals.bookingPresence === 'indirect') {
    strengths.push('Visitors can see booking intent, even if the action path is not yet especially direct.');
  }

  if (signals.contactClarity === 'high') {
    strengths.push('The contact surface is clear and usable.');
  } else if (signals.contactClarity === 'medium') {
    strengths.push('The site still gives visitors workable contact options.');
  }

  if (signals.trustSignalStrength === 'high') {
    strengths.push('Trust cues are visible across the site.');
  } else if (signals.trustSignalStrength === 'medium') {
    strengths.push('There are enough visible trust cues to support a credible review.');
  }

  if (snapshot.trustSignals.includes('mentions patient comfort')) {
    strengths.push('Patient comfort is part of the site messaging, which helps reduce hesitation.');
  }

  if (snapshot.trustSignals.includes('mentions advanced technology')) {
    strengths.push('The site signals modern treatment quality, which can reinforce credibility.');
  }

  if (tone === 'bilingual') {
    strengths.push(
      'The site combines German and English messaging, which makes the lead feel accessible without losing local context.',
    );
  } else if (tone === 'english_led') {
    strengths.push(
      'The site is easy to understand in English while still staying tied to the local market.',
    );
  }

  if (specialtyFocus) {
    strengths.push(
      `The site makes its ${specialtyFocus} visible, which helps the lead feel more specific and commercially usable.`,
    );
  }

  return [...new Set(strengths)].slice(0, 5);
};

const buildMediumLeadOpportunities = (input: GenerateAuditInput): string[] => {
  const { signals } = input;
  const opportunities: string[] = [];
  const weakContactSurface = detectWeakContactSurface(input);

  if (hasLocationMismatchRisk(input)) {
    opportunities.push(
      'The visible local market does not line up cleanly with the recorded lead geography.',
    );
  }

  if (signals.bookingPresence === 'indirect') {
    opportunities.push('The booking path is present, but it still feels softer and less direct than it should.');
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    opportunities.push('A direct booking route is already visible, but the surrounding contact experience still feels thinner than the strongest leads.');
  }

  opportunities.push('The site has enough credibility to work commercially, but it does not yet turn that credibility into a strong enough next step.');

  if (signals.contactClarity === 'medium') {
    opportunities.push('The contact path could feel more guided and less distributed.');
  }

  const weakContactOpportunity = buildWeakContactOpportunity(weakContactSurface);
  if (weakContactOpportunity) {
    opportunities.push(weakContactOpportunity);
  }

  return [...new Set(opportunities)].slice(0, 3);
};

const buildMediumLeadOpportunityDetails = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const details: string[] = [];
  const weakContactSurface = detectWeakContactSurface(input);
  const specialtyFocus = detectSpecialtyFocus(
    `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`,
  );

  if (hasLocationMismatchRisk(input)) {
    details.push(
      'The site may still be real and commercially usable, but the visible market cues do not line up cleanly with the recorded lead geography. That makes qualification less certain before outreach starts.',
    );
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    details.push(
      'Visitors can likely book directly, but the surrounding contact surface still feels thinner than the strongest local sites. That means the opportunity is real, yet still a little less complete than the best benchmark leads.',
    );
  }

  if (signals.bookingPresence === 'indirect') {
    details.push(
      'Visitors can likely find a route to book, but the site still makes the action feel more optional than immediate. That usually means some intent is being left on the table.',
    );
  }

  if (signals.contactClarity === 'medium') {
    details.push(
      'The contact surface is workable, but it still feels broader than necessary. A stronger primary path would make the next step easier to trust and easier to take.',
    );
  }

  const weakContactDetail = buildWeakContactDetail(weakContactSurface);
  if (weakContactDetail) {
    details.push(weakContactDetail);
  }

  if (signals.trustSignalStrength !== 'low') {
    details.push(
      'This is not a low-trust site. The stronger opportunity is to package the visible trust cues into a clearer commercial case for action.',
    );
  }

  if (snapshot.trustSignals.includes('mentions patient comfort')) {
    details.push(
      'Comfort and reassurance are visible in the messaging, but they are not yet carried strongly enough into the booking decision itself.',
    );
  }

  if (specialtyFocus) {
    details.push(
      `The ${specialtyFocus} positioning is already visible enough to support a more specific conversion angle, but it is not yet turned into a strong enough next-step message.`,
    );
  }

  return [...new Set(details)].slice(0, 4);
};

const buildMediumLeadRecommendedAngle = (input: GenerateAuditInput): string => {
  const { signals, snapshot } = input;
  const tone = detectLanguageTone(getSnapshotText(snapshot));

  if (hasLocationMismatchRisk(input)) {
    return 'Lead with the qualification gap first: the site looks real, but the visible local market does not line up cleanly with the recorded lead geography.';
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    if (tone === 'bilingual') {
      return 'Lead with the direct booking route, then tighten the surrounding contact surface so the bilingual presentation feels less thin and more decisive.';
    }

    if (tone === 'english_led') {
      return 'Lead with the direct booking route, then tighten the surrounding contact surface so the English-led clarity feels less thin and more decisive.';
    }

    return 'Lead with the direct booking route, then tighten the surrounding contact surface so the next step feels less thin and more decisive.';
  }

  if (signals.bookingPresence === 'indirect') {
    if (tone === 'bilingual') {
      return 'Lead with how the bilingual presentation could be turned into a clearer and less hesitant booking step.';
    }

    if (tone === 'english_led') {
      return 'Lead with the English-led clarity, then tighten the next step so action feels more immediate.';
    }

    return 'Lead with the gap between visible intent and decisive action: the site has enough trust to work, but the route into booking still feels too soft.';
  }

  if (tone === 'bilingual') {
    return 'Lead with how the bilingual presentation could be turned into a clearer and more direct next step for visitors.';
  }

  if (tone === 'english_led') {
    return 'Lead with the English-led presentation and turn that clarity into a simpler next step.';
  }

  return 'Lead with how existing local credibility could be turned into a clearer and more directed next step for visitors.';
};

const buildMediumLeadConfidenceNote = (input: GenerateAuditInput): string => {
  const { lead } = input;

  if (hasLocationMismatchRisk(input)) {
    return 'Confidence is medium: the site appears real, but outreach-fit confidence drops because the visible local market does not line up cleanly with the recorded lead geography.';
  }

  if (lead.completeness !== 'complete') {
    return 'Confidence is medium: this looks like a valid lead with enough site substance for a grounded review, but thinner lead context still limits precision.';
  }

  return 'Confidence is medium: the site gives enough commercial signal to support a grounded review, but the opportunity still benefits from human judgment.';
};

const buildMediumLeadQuickWins = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const weakContactSurface = detectWeakContactSurface(input);
  const quickWins: string[] = [
    'Make the main next step easier to identify and easier to trust.',
    'Turn the strongest visible trust cue into a more explicit reason to act now.',
  ];

  if (hasLocationMismatchRisk(input)) {
    quickWins.unshift('Verify the lead geography before using a normal local-practice outreach angle.');
  }

  if (signals.bookingPresence === 'indirect') {
    quickWins.push('Reduce friction between booking intent and the first actual booking action.');
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    quickWins.push('Keep the direct booking route visible while tightening the surrounding contact surface.');
  }

  if (signals.contactClarity === 'medium') {
    quickWins.push('Promote one clear contact or booking path above the rest.');
  }

  if (weakContactSurface === 'email_only') {
    quickWins.push('Add a phone option or stronger immediate-response path beside email.');
  } else if (weakContactSurface === 'phone_only') {
    quickWins.push('Add a visible email or written inquiry path beside the phone option.');
  } else if (weakContactSurface === 'address_only') {
    quickWins.push('Add a visible phone or email path instead of relying on address details alone.');
  }

  if (specialtyFocus) {
    quickWins.push(`Bring the ${specialtyFocus} positioning closer to the main booking or contact action.`);
  }

  if (tone === 'bilingual') {
    quickWins.push('Use the bilingual presentation to make one primary next step obvious.');
  } else if (tone === 'english_led') {
    quickWins.push('Pair the English-led explanation with one very clear action prompt.');
  }

  return [...new Set(quickWins)].slice(0, 3);
};

const buildMediumLeadOutreachHook = (input: GenerateAuditInput): string => {
  const { signals, snapshot } = input;
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);

  if (hasLocationMismatchRisk(input)) {
    return 'The site looks real, but the visible local market does not line up cleanly with the recorded lead location, so this needs qualification before outreach.';
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    if (tone === 'bilingual') {
      return 'The site already offers a direct booking route, but the surrounding contact surface still feels thinner than the strongest leads, so the bilingual story could be tightened before outreach.';
    }

    if (tone === 'english_led') {
      return 'The site already offers a direct booking route, but the surrounding contact surface still feels thinner than the strongest leads, so the English-led story could be tightened before outreach.';
    }

    if (specialtyFocus) {
      return `The site already offers a direct booking route and makes its ${specialtyFocus} visible, but the surrounding contact surface still feels thinner than the strongest leads.`;
    }

    return 'The site already offers a direct booking route, but the surrounding contact surface still feels thinner than the strongest leads.';
  }

  if (signals.bookingPresence === 'indirect') {
    if (tone === 'bilingual') {
      return 'The site already feels credible enough to work in both German and English, but the path from interest to booking still feels too soft.';
    }

    if (tone === 'english_led') {
      return 'The site already feels credible enough to work in English, but the path from interest to booking still feels too soft.';
    }

    if (specialtyFocus) {
      return `The site already feels credible enough to work, and its ${specialtyFocus} is visible, but the path from interest to booking still feels too soft.`;
    }

    return 'The site already feels credible enough to work, but the path from interest to booking still feels too soft.';
  }

  if (tone === 'bilingual') {
    return 'The site feels commercially valid, and its bilingual presentation keeps it easy to approach, but that clarity could still become a more decisive next step.';
  }

  if (tone === 'english_led') {
    return 'The site feels commercially valid, and its English-led presentation keeps it easy to approach, but that clarity could still become a more decisive next step.';
  }

  if (specialtyFocus) {
    return `The site feels commercially valid, and its ${specialtyFocus} is visible, but that specialist positioning could be turned into a much clearer next step.`;
  }

  return 'The site feels commercially valid, but it could turn trust and local relevance into a much clearer next step.';
};

const buildMediumLeadEvidence = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const evidence: string[] = [];
  const combinedText = getSnapshotText(snapshot);
  const specialtyFocus = detectSpecialtyFocus(combinedText);
  const tone = detectLanguageTone(combinedText);
  const weakContactSurface = detectWeakContactSurface(input);
  const brandHeavyMultiSpecialty =
    specialtyFocus === 'multi-specialty practice' &&
    detectBrandHeavyMultiSpecialtyPresentation(combinedText);

  if (hasLocationMismatchRisk(input)) {
    evidence.push('The visible site market does not line up cleanly with the recorded lead location.');
  }

  if (signals.localRelevance === 'high_match') {
    evidence.push('The site strongly reflects the target local market.');
  } else if (signals.localRelevance === 'partial_match') {
    evidence.push('The site still shows meaningful local relevance, though not at the strongest level.');
  }

  if (signals.bookingPresence === 'direct' && snapshot.bookingLinks[0]) {
    evidence.push(`Direct booking link found: ${snapshot.bookingLinks[0]}`);
  } else if (signals.bookingPresence === 'indirect') {
    evidence.push('Booking-related language is visible, but the direct path to action still feels less explicit than it should.');
  }

  if (signals.bookingPresence === 'direct' && hasNoLeadLevelContactSurface(input)) {
    evidence.push(
      'A direct booking route is visible, but the surrounding contact surface still feels thinner than the strongest benchmark leads.',
    );
  }

  if (brandHeavyMultiSpecialty) {
    evidence.push('The site reads as a brand-heavy multi-specialty practice with visible booking access.');
  }

  if (signals.contactClarity === 'high') {
    evidence.push('Contact options are clearly visible on the page.');
  } else if (signals.contactClarity === 'medium') {
    evidence.push('The page provides workable contact options, but the contact path is not especially focused.');
  }

  const weakContactEvidence = buildWeakContactEvidence(weakContactSurface);
  if (weakContactEvidence) {
    evidence.push(weakContactEvidence);
  }

  if (signals.trustSignalStrength === 'high') {
    evidence.push('Multiple trust cues are visible across the site.');
  } else if (signals.trustSignalStrength === 'medium') {
    evidence.push('Several trust cues are visible, which is enough to support a grounded commercial read.');
  }

  if (snapshot.trustSignals.length > 0) {
    evidence.push(`Trust cues observed: ${snapshot.trustSignals.slice(0, 3).join(', ')}.`);
  }

  if (snapshot.pageTitle) {
    evidence.push(`Page title observed: ${snapshot.pageTitle}`);
  }

  if (snapshot.metaDescription) {
    evidence.push(`Meta description observed: ${snapshot.metaDescription}`);
  }

  if (specialtyFocus) {
    evidence.push(`A visible specialty focus is present in the site copy: ${specialtyFocus}.`);
  }

  if (tone === 'bilingual') {
    evidence.push('The site blends German and English messaging, which keeps the lead broadly accessible.');
  } else if (tone === 'english_led') {
    evidence.push('The site is written in English while still naming the local market explicitly.');
  }

  return [...new Set(evidence)].slice(0, 6);
};

const buildGeneralStrengths = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const strengths: string[] = [];

  if (signals.trustSignalStrength === 'high') {
    strengths.push('Multiple trust cues are visible across the site.');
  }

  if (signals.contactClarity === 'high') {
    strengths.push('Users have a clear path to contact the business and take action.');
  } else if (signals.contactClarity === 'medium') {
    strengths.push('Users can find several ways to contact the business.');
  }

  if (signals.businessScale === 'large_chain' || signals.businessScale === 'multi_location') {
    strengths.push('The site clearly presents the business at meaningful scale.');
  }

  if (snapshot.trustSignals.length > 0 && strengths.length < 3) {
    strengths.push(
      `Trust is reinforced through visible cues such as ${snapshot.trustSignals.slice(0, 2).join(' and ')}.`,
    );
  }

  return [...new Set(strengths)].slice(0, 4);
};

const buildGeneralOpportunities = (input: GenerateAuditInput): string[] => {
  const { signals } = input;
  const opportunities: string[] = [];

  if (signals.bookingPresence === 'indirect') {
    opportunities.push('Booking path feels indirect.');
  }

  if (signals.bookingPresence === 'not_detected') {
    opportunities.push('Booking path is not clearly visible.');
  }

  if (signals.contactClarity === 'medium') {
    opportunities.push('Contact flow looks broad rather than guided.');
  }

  if (signals.localRelevance !== 'high_match') {
    opportunities.push('Local positioning could be sharpened.');
  }

  return [...new Set(opportunities)].slice(0, 3);
};

const buildGeneralOpportunityDetails = (
  input: GenerateAuditInput,
): string[] => {
  const { signals } = input;
  const details: string[] = [];

  if (signals.bookingPresence === 'indirect') {
    details.push(
      'Users likely encounter more steps or decisions than necessary before they reach a booking action, which can weaken commitment at the point where conversion should feel easiest.',
    );
  }

  if (signals.bookingPresence === 'not_detected') {
    details.push(
      'A visible booking route does not stand out clearly. That may reduce the number of visitors who move from interest to action.',
    );
  }

  if (signals.contactClarity === 'medium') {
    details.push(
      'The contact surface looks broad rather than deliberately guided. That can make the experience feel administrative rather than action-oriented, especially for users who want one obvious next step.',
    );
  }

  if (signals.localRelevance !== 'high_match') {
    details.push(
      'The business may be relevant, but the local positioning is not yet reinforced strongly enough to support the best possible outreach angle.',
    );
  }

  return [...new Set(details)].slice(0, 3);
};

const buildGeneralRisks = (input: GenerateAuditInput): string[] => {
  const { lead, signals } = input;
  const risks: string[] = [];

  if (lead.completeness !== 'complete') {
    risks.push('Incomplete lead data lowers confidence in both targeting accuracy and fit assessment.');
  }

  if (signals.businessScale === 'large_chain') {
    risks.push('The scale of the business makes a small-practice or highly localized offer less naturally relevant.');
  } else if (signals.businessScale === 'multi_location') {
    risks.push('The site reads like a multi-site brand, which makes a single-practice local pitch less natural.');
  }

  if (signals.localRelevance === 'low_match') {
    risks.push('The website content does not align closely with the lead’s recorded geography, which raises qualification concerns before outreach even begins.');
  }

  if (signals.outreachFit === 'poor') {
    risks.push('This lead is unlikely to convert under the current outreach wedge without a materially different positioning strategy.');
  }

  return [...new Set(risks)].slice(0, 4);
};

const buildGeneralRecommendedAngle = (input: GenerateAuditInput): string => {
  const { signals } = input;

  if (signals.outreachFit === 'poor') {
    return 'Deprioritize this lead for the current campaign, or approach it only with a more strategic, higher-level positioning that fits a larger organization.';
  }

  if (signals.bookingPresence === 'indirect') {
    return 'Lead with booking-path clarity and conversion efficiency rather than broad marketing or brand language.';
  }

  if (signals.bookingPresence === 'not_detected') {
    return 'Lead with the missed-conversion risk created by the absence of a clear booking path.';
  }

  return 'Lead with a focused conversion angle tied to ease of action and booking clarity.';
};

const buildGeneralConfidenceNote = (input: GenerateAuditInput): string => {
  const { lead } = input;

  if (lead.completeness !== 'complete') {
    return 'Confidence is moderated by incomplete lead metadata, especially around geography and source context.';
  }

  return 'Confidence is reasonably supported by the visible site signals and lead context.';
};

const buildGeneralQuickWins = (input: GenerateAuditInput): string[] => {
  const { signals } = input;
  const quickWins: string[] = [];

  if (signals.bookingPresence === 'indirect') {
    quickWins.push('Reduce the number of steps between visitor intent and the booking action.');
  }

  if (signals.bookingPresence === 'not_detected') {
    quickWins.push('Add a visible booking call to action on the main service pages.');
  }

  if (signals.contactClarity !== 'high') {
    quickWins.push('Present one primary contact path instead of a broad set of equally weighted options.');
  }

  if (signals.localRelevance !== 'high_match') {
    quickWins.push('Strengthen local market positioning in the core page messaging.');
  }

  if (quickWins.length === 0) {
    quickWins.push('Clarify the primary action visitors should take first.');
  }

  return [...new Set(quickWins)].slice(0, 3);
};

const buildGeneralOutreachHook = (input: GenerateAuditInput): string => {
  const { signals } = input;

  if (signals.outreachFit === 'poor') {
    return 'This lead looks structurally misaligned with the current outreach wedge and may need a different strategic angle.';
  }

  if (signals.bookingPresence === 'indirect') {
    return 'There appears to be real intent on the site, but the path from interest to booking is less direct than it should be.';
  }

  if (signals.bookingPresence === 'not_detected') {
    return 'The clearest issue is the lack of an obvious booking path for already interested visitors.';
  }

  return 'The site has enough credibility to engage, but the next-step experience could be made more decisive.';
};

const buildGeneralEvidence = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const evidence: string[] = [];
  const combinedText = getSnapshotText(snapshot);
  const hasNetworkStyle = detectNetworkStyle(combinedText);
  const hasBrandLedNetworkCopy = /zahnzentrum|standortleitung|geschaeftsleitung|gesch[aä]ftsleitung|medical board|praxisnetz|alldent/i.test(
    combinedText,
  );

  if (signals.bookingPresence === 'indirect') {
    evidence.push(
      'Booking-related language is present, but no direct booking link was extracted.',
    );
  }

  if (signals.bookingPresence === 'not_detected') {
    evidence.push(
      'No clear booking path was visible in the current site content.',
    );
  }

  if (signals.businessScale === 'large_chain') {
    if (hasBrandLedNetworkCopy) {
      evidence.push(
        'The site uses network-style branding and multiple location references rather than a single local-practice story.',
      );
    } else {
      evidence.push(
        'The site presents the business as a large multi-location network rather than a single local practice.',
      );
    }
  } else if (signals.businessScale === 'multi_location' || hasNetworkStyle) {
    evidence.push(
      'The site uses network-style branding and multiple location references rather than a single local-practice story.',
    );
  }

  if (signals.localRelevance === 'low_match') {
    evidence.push(
      'The recorded lead location is not clearly reflected in the site content.',
    );
  }

  if (signals.trustSignalStrength === 'high') {
    evidence.push(
      'Multiple trust cues are visible, including team presence, emergency availability, and scale-related signals.',
    );
  }

  if (signals.contactClarity === 'medium') {
    evidence.push(
      'The contact surface is extensive, but it appears distributed rather than tightly guided.',
    );
  }

  if (snapshot.pageTitle) {
    evidence.push(`Page title observed: ${snapshot.pageTitle}`);
  }

  if (snapshot.metaDescription) {
    evidence.push(`Meta description observed: ${snapshot.metaDescription}`);
  }

  return [...new Set(evidence)].slice(0, 7);
};

const isBrandHeavyMultiSpecialtyAuditLead = (
  input: GenerateAuditInput,
): boolean => {
  const combinedText = getSnapshotText(input.snapshot);
  const brandFootprint =
    /zahnzentrum|zahnspezialisten|zahnarztzentrum|alldent|all dent|praxisnetz|dental group|medical board|standortleitung/i.test(
      combinedText,
    );

  return (
    input.signals.outreachFit === 'uncertain' &&
    input.signals.trustSignalStrength !== 'high' &&
    input.snapshot.bookingLinks.length > 0 &&
    hasCompleteContactSurface(input) &&
    brandFootprint &&
    detectSpecialtyFocus(combinedText) === 'multi-specialty practice'
  );
};

const buildBrandHeavyMultiSpecialtySummary = (
  input: GenerateAuditInput,
): string => {
  return `${input.lead.companyName} reads as a brand-heavy multi-specialty practice with a visible booking path. It is commercially valid, but the presentation still needs a human check before the opportunity can be translated into a sharper outreach angle.`;
};

const buildBrandHeavyMultiSpecialtyStrengths = (): string[] => {
  return [
    'The site combines multiple specialty cues with a visible booking path.',
    'The business presents a clear local footprint rather than a thin generic clinic story.',
    'Contact channels are visible and easy to validate.',
  ];
};

const buildBrandHeavyMultiSpecialtyOpportunities = (): string[] => {
  return [
    'The brand-heavy presentation could be translated into a clearer multi-specialty booking angle.',
    'The site has enough structure to support outreach, but the marketing story still deserves a human review first.',
  ];
};

const buildBrandHeavyMultiSpecialtyOpportunityDetails = (): string[] => {
  return [
    'The multi-specialty positioning is broad enough to be commercially useful, but it still needs a sharper entry point.',
    'The direct booking path makes this a review case rather than a generic local-practice pass.',
  ];
};

const buildBrandHeavyMultiSpecialtyRisks = (): string[] => {
  return [
    'The network-style presentation can make the lead feel broader than a focused clinic.',
    'A human should confirm the best angle before sending.',
  ];
};

const buildBrandHeavyMultiSpecialtyRecommendedAngle = (): string => {
  return 'Lead with the multi-specialty practice and the direct booking path, but keep the wording grounded in the local footprint.';
};

const buildBrandHeavyMultiSpecialtyConfidenceNote = (): string => {
  return 'Confidence is medium because the site is commercially valid and easy to classify, but the brand-heavy presentation still needs a human check.';
};

const buildBrandHeavyMultiSpecialtyQuickWins = (): string[] => {
  return [
    'Use the multi-specialty practice and direct booking path together in the main message.',
    'Keep the wording tied to the local footprint instead of generic brand language.',
  ];
};

const buildBrandHeavyMultiSpecialtyOutreachHook = (): string => {
  return 'The site is commercially valid, but the brand-heavy presentation suggests the angle should be reviewed before outreach.';
};

const buildBrandHeavyMultiSpecialtyEvidence = (
  input: GenerateAuditInput,
): string[] => {
  const evidence = [
    'The site reads as a brand-heavy multi-specialty practice with visible booking access.',
    'The business presents a clear local footprint rather than an anonymous generic web presence.',
  ];

  if (input.snapshot.bookingLinks[0]) {
    evidence.push(`A direct booking path is already present: ${input.snapshot.bookingLinks[0]}`);
  }

  if (hasCompleteContactSurface(input)) {
    evidence.push('Email and phone contact paths are both visible on the page.');
  }

  return [...new Set(evidence)].slice(0, 5);
};

export class MockAuditGenerator implements AuditGenerator {
  async generate(input: GenerateAuditInput): Promise<GeneratedAuditDraft> {
    if (input.snapshot.isPlaceholderContent) {
      return buildPlaceholderAudit(input);
    }

    if (input.signals.outreachFit === 'good') {
      return {
        summary: buildGoodLeadSummary(input),
        strengths: buildGoodLeadStrengths(input),
        opportunities: buildGoodLeadOpportunities(input),
        opportunityDetails: buildGoodLeadOpportunityDetails(input),
        risks: buildGoodLeadRisks(input),
        recommendedAngle: buildGoodLeadRecommendedAngle(input),
        confidenceNote: buildGoodLeadConfidenceNote(input),
        quickWins: buildGoodLeadQuickWins(input),
        outreachHook: buildGoodLeadOutreachHook(input),
        evidence: buildGoodLeadEvidence(input),
      };
    }

    if (isBrandHeavyMultiSpecialtyAuditLead(input)) {
      return {
        summary: buildBrandHeavyMultiSpecialtySummary(input),
        strengths: buildBrandHeavyMultiSpecialtyStrengths(),
        opportunities: buildBrandHeavyMultiSpecialtyOpportunities(),
        opportunityDetails: buildBrandHeavyMultiSpecialtyOpportunityDetails(),
        risks: buildBrandHeavyMultiSpecialtyRisks(),
        recommendedAngle: buildBrandHeavyMultiSpecialtyRecommendedAngle(),
        confidenceNote: buildBrandHeavyMultiSpecialtyConfidenceNote(),
        quickWins: buildBrandHeavyMultiSpecialtyQuickWins(),
        outreachHook: buildBrandHeavyMultiSpecialtyOutreachHook(),
        evidence: buildBrandHeavyMultiSpecialtyEvidence(input),
      };
    }

    if (isValidButThinnerLead(input)) {
      return {
        summary: buildMediumLeadSummary(input),
        strengths: buildMediumLeadStrengths(input),
        opportunities: buildMediumLeadOpportunities(input),
        opportunityDetails: buildMediumLeadOpportunityDetails(input),
        risks: buildGeneralRisks(input),
        recommendedAngle: buildMediumLeadRecommendedAngle(input),
        confidenceNote: buildMediumLeadConfidenceNote(input),
        quickWins: buildMediumLeadQuickWins(input),
        outreachHook: buildMediumLeadOutreachHook(input),
        evidence: buildMediumLeadEvidence(input),
      };
    }

    return {
      summary: buildGeneralSummary(input),
      strengths: buildGeneralStrengths(input),
      opportunities: buildGeneralOpportunities(input),
      opportunityDetails: buildGeneralOpportunityDetails(input),
      risks: buildGeneralRisks(input),
      recommendedAngle: buildGeneralRecommendedAngle(input),
      confidenceNote: buildGeneralConfidenceNote(input),
      quickWins: buildGeneralQuickWins(input),
      outreachHook: buildGeneralOutreachHook(input),
      evidence: buildGeneralEvidence(input),
    };
  }
}
