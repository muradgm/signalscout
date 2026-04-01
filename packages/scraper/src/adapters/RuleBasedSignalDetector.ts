import type {
  BookingPresence,
  BusinessScale,
  ContactClarity,
  Lead,
  LeadSnapshot,
  LocalRelevance,
  OutreachFit,
  SignalConfidence,
  SignalDetector,
  SignalSet,
  TrustSignalStrength,
} from '@signalscout/core';

const normalize = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, ' ').trim();

const countOccurrences = (text: string, patterns: RegExp[]): number => {
  return patterns.reduce((count, pattern) => {
    const matches = text.match(pattern);
    return count + (matches?.length ?? 0);
  }, 0);
};

const hasCompleteLeadContext = (lead: Lead): boolean => {
  return lead.completeness === 'complete';
};

const BERLIN_DISTRICT_ALIASES: string[] = [
  'prenzlauer berg',
  'mitte',
  'kreuzberg',
  'friedrichshain',
  'neukölln',
  'charlottenburg',
  'wilmersdorf',
  'schöneberg',
  'tempelhof',
  'moabit',
  'wedding',
  'spandau',
  'pankow',
  'lichtenberg',
  'marzahn',
  'hellersdorf',
  'reinickendorf',
  'zehlendorf',
  'steglitz',
  'köpenick',
  'treptow',
];

const buildLocationCandidates = (location: string): string[] => {
  const normalizedLocation = normalize(location);

  if (!normalizedLocation) {
    return [];
  }

  const candidates = new Set<string>([normalizedLocation]);

  if (normalizedLocation === 'berlin') {
    for (const district of BERLIN_DISTRICT_ALIASES) {
      candidates.add(district);
    }
  }

  return [...candidates];
};

const findFirstMatchingLocationCandidate = (
  text: string,
  candidates: string[],
): string | null => {
  for (const candidate of candidates) {
    if (candidate.length > 0 && text.includes(candidate)) {
      return candidate;
    }
  }

  return null;
};

const getBookingHintMatches = (snapshot: LeadSnapshot): string[] => {
  const combinedText = normalize(
    `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`,
  );

  const hintRules: Array<{ label: string; pattern: RegExp }> = [
    { label: 'online appointment language detected', pattern: /\bonline appointment\b/i },
    { label: 'online booking language detected', pattern: /\bonline booking\b/i },
    { label: 'book now language detected', pattern: /\bbook now\b/i },
    {
      label: 'schedule-an-appointment language detected',
      pattern: /\bschedule an appointment\b/i,
    },
    {
      label: 'termin vereinbaren language detected',
      pattern: /\btermin vereinbaren\b/i,
    },
    { label: 'jetzt buchen language detected', pattern: /\bjetzt buchen\b/i },
    { label: 'appointment language detected', pattern: /\bappointment\b/i },
    { label: 'booking language detected', pattern: /\bbooking\b/i },
    { label: 'buchen language detected', pattern: /\bbuchen\b/i },
    { label: 'termin language detected', pattern: /\btermin\b/i },
  ];

  const matches: string[] = [];

  for (const rule of hintRules) {
    if (rule.pattern.test(combinedText)) {
      matches.push(rule.label);
    }
  }

  return matches;
};

const detectBookingPresence = (
  snapshot: LeadSnapshot,
): { value: BookingPresence; evidence: string[]; directEvidence: boolean } => {
  const evidence: string[] = [];

  if (snapshot.bookingLinks.length > 0) {
    evidence.push(
      `direct booking access detected via ${snapshot.bookingLinks.length} extracted booking link${
        snapshot.bookingLinks.length === 1 ? '' : 's'
      }`,
    );

    for (const link of snapshot.bookingLinks.slice(0, 2)) {
      evidence.push(`booking link extracted: ${link}`);
    }

    return {
      value: 'direct',
      evidence,
      directEvidence: true,
    };
  }

  const hintMatches = getBookingHintMatches(snapshot);

  if (hintMatches.length > 0) {
    evidence.push(
      'booking intent appears on page, but no direct booking link was extracted',
    );
    evidence.push(...hintMatches.slice(0, 4));

    return {
      value: 'indirect',
      evidence,
      directEvidence: false,
    };
  }

  evidence.push('no booking link or booking language detected');

  return {
    value: 'not_detected',
    evidence,
    directEvidence: false,
  };
};

const detectContactClarity = (
  snapshot: LeadSnapshot,
  businessScale: BusinessScale,
): { value: ContactClarity; evidence: string[] } => {
  const evidence: string[] = [];

  const emailCount = snapshot.contactInfo.emails.length;
  const phoneCount = snapshot.contactInfo.phones.length;
  const totalContacts = emailCount + phoneCount;

  if (totalContacts === 0) {
    evidence.push('no email or phone contact points detected');

    return { value: 'low', evidence };
  }

  if (businessScale === 'large_chain' && totalContacts > 10) {
    evidence.push(
      `contact surface appears broad and distributed (${emailCount} emails, ${phoneCount} phones), which may reduce actionability for focused outreach`,
    );

    return { value: 'medium', evidence };
  }

  if (emailCount >= 1 && phoneCount >= 1 && totalContacts <= 10) {
    evidence.push(
      `clear contact surface detected with ${emailCount} email(s) and ${phoneCount} phone number(s)`,
    );

    return { value: 'high', evidence };
  }

  evidence.push(
    `partial contact surface detected with ${emailCount} email(s) and ${phoneCount} phone number(s)`,
  );

  return { value: 'medium', evidence };
};

const detectTrustSignalStrength = (
  snapshot: LeadSnapshot,
): { value: TrustSignalStrength; evidence: string[] } => {
  const evidence = snapshot.trustSignals.map(
    (signal: string) => `trust indicator detected: ${signal}`,
  );
  const count = snapshot.trustSignals.length;

  if (count >= 4) {
    return { value: 'high', evidence };
  }

  if (count >= 2) {
    return { value: 'medium', evidence };
  }

  return {
    value: 'low',
    evidence:
      evidence.length > 0 ? evidence : ['few trust indicators detected on page'],
  };
};

const detectBusinessScale = (
  snapshot: LeadSnapshot,
): { value: BusinessScale; evidence: string[] } => {
  const text = normalize(
    `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`,
  );

  const evidence: string[] = [];

  const multiLocationMentions = countOccurrences(text, [
    /\blocations\b/gi,
    /\bstandorte\b/gi,
    /\bcentres\b/gi,
    /\bclinics\b/gi,
  ]);

  const numericLocationMentions = countOccurrences(text, [
    /\bover \d+\s+locations\b/gi,
    /\bmore than \d+\s+locations\b/gi,
    /\b\d+\s+locations\b/gi,
    /\bmehr als \d+\s+standorte\b/gi,
    /\b\d+\s+standorte\b/gi,
  ]);

  if (numericLocationMentions >= 1 || multiLocationMentions >= 5) {
    evidence.push('site presents itself as a multi-location network at large scale');
    evidence.push(
      `location-network evidence found (${multiLocationMentions} general mentions, ${numericLocationMentions} explicit count mentions)`,
    );

    return { value: 'large_chain', evidence };
  }

  if (
    multiLocationMentions >= 1 ||
    snapshot.trustSignals.includes('mentions multiple locations')
  ) {
    evidence.push('site shows evidence of operating across multiple locations');

    return { value: 'multi_location', evidence };
  }

  evidence.push('no strong multi-location evidence detected');

  return { value: 'single_location', evidence };
};

const detectLocalRelevance = (
  lead: Lead,
  snapshot: LeadSnapshot,
): { value: LocalRelevance; evidence: string[]; leadContextComplete: boolean } => {
  const text = normalize(
    `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`,
  );

  const evidence: string[] = [];
  const location = normalize(lead.location ?? '');
  const country = normalize(lead.country ?? '');

  const leadContextComplete = hasCompleteLeadContext(lead);

  const locationCandidates = buildLocationCandidates(location);
  const matchedLocationCandidate = findFirstMatchingLocationCandidate(
    text,
    locationCandidates,
  );

  const locationMatch = matchedLocationCandidate !== null;
  const countryMatch = country.length > 0 && text.includes(country);

  if (!lead.location?.trim()) {
    evidence.push('lead location is missing');
  } else if (locationMatch) {
    if (matchedLocationCandidate === location) {
      evidence.push(`lead location appears in site content: ${lead.location}`);
    } else {
      evidence.push(
        `lead location is strongly supported by district-level site content: ${matchedLocationCandidate}`,
      );
    }
  } else {
    evidence.push(`lead location does not appear in site content: ${lead.location}`);
  }

  if (!lead.country?.trim()) {
    evidence.push('lead country is missing');
  } else {
    evidence.push(
      countryMatch
        ? `lead country appears in site content: ${lead.country}`
        : `lead country does not appear in site content: ${lead.country}`,
    );
  }

  if (locationMatch && (countryMatch || !lead.country?.trim())) {
    return {
      value: 'high_match',
      evidence,
      leadContextComplete,
    };
  }

  if (locationMatch || countryMatch) {
    return {
      value: 'partial_match',
      evidence,
      leadContextComplete,
    };
  }

  return {
    value: 'low_match',
    evidence,
    leadContextComplete,
  };
};

const detectOutreachFit = (
  businessScale: BusinessScale,
  localRelevance: LocalRelevance,
): { value: OutreachFit; reason: string } => {
  if (businessScale === 'large_chain' && localRelevance === 'low_match') {
    return {
      value: 'poor',
      reason:
        'The lead appears to be a large chain with weak geographic alignment to the intended local-market offer.',
    };
  }

  if (businessScale === 'single_location' && localRelevance === 'high_match') {
    return {
      value: 'good',
      reason:
        'The lead appears locally aligned and structurally close to the intended single-practice offer.',
    };
  }

  return {
    value: 'uncertain',
    reason:
      'The lead shows mixed signals for fit and may require human review before outreach.',
  };
};

const detectConfidence = (
  bookingPresence: BookingPresence,
  trustSignalStrength: TrustSignalStrength,
  localRelevance: LocalRelevance,
  leadContextComplete: boolean,
  hasDirectBookingEvidence: boolean,
): SignalConfidence => {
  let score = 0;

  if (hasDirectBookingEvidence) {
    score += 2;
  } else if (bookingPresence === 'indirect') {
    score += 1;
  }

  if (trustSignalStrength === 'high') score += 2;
  if (trustSignalStrength === 'medium') score += 1;

  if (localRelevance === 'high_match') score += 2;
  if (localRelevance === 'partial_match') score += 1;

  if (leadContextComplete) {
    score += 1;
  }

  if (score >= 6) {
    return 'high';
  }

  if (score >= 3) {
    return 'medium';
  }

  return 'low';
};

const buildIssuesDetected = (
  bookingPresence: BookingPresence,
  contactClarity: ContactClarity,
  trustSignalStrength: TrustSignalStrength,
  businessScale: BusinessScale,
  localRelevance: LocalRelevance,
  outreachFit: OutreachFit,
): string[] => {
  const issues: string[] = [];

  if (bookingPresence === 'not_detected') {
    issues.push('booking path not detected');
  }

  if (bookingPresence === 'indirect') {
    issues.push('booking path appears indirect or unclear');
  }

  if (contactClarity === 'low') {
    issues.push('contact information is limited or unclear');
  }

  if (trustSignalStrength === 'low') {
    issues.push('trust signals appear limited');
  }

  if (businessScale === 'large_chain') {
    issues.push('business appears to be a large chain, which may affect outreach fit');
  }

  if (localRelevance === 'low_match') {
    issues.push('website content appears weakly matched to the lead location or country');
  }

  if (localRelevance === 'partial_match') {
    issues.push('website content only partially matches the lead location or country');
  }

  if (outreachFit === 'poor') {
    issues.push('current lead may be a poor fit for the intended outreach offer');
  }

  return issues;
};

const dedupeEvidence = (evidence: string[]): string[] => [...new Set(evidence)];

export class RuleBasedSignalDetector implements SignalDetector {
  async detect(lead: Lead, snapshot: LeadSnapshot): Promise<SignalSet> {
    if (snapshot.isPlaceholderContent) {
      return {
        bookingPresence: 'not_detected',
        contactClarity: 'low',
        trustSignalStrength: 'low',
        businessScale: 'single_location',
        localRelevance: 'low_match',
        outreachFit: 'poor',
        fitReason:
          'The site appears to be placeholder or inactive content, so it is not a reliable basis for outreach.',
        confidence: 'low',
        leadCompleteness: lead.completeness,
        issuesDetected: [
          'website appears to contain placeholder or inactive content',
          'site content is too weak to support a credible audit or outreach decision',
        ],
        evidence: dedupeEvidence([
          'placeholder-style content was detected in the visible page text',
          ...(snapshot.pageTitle ? [`page title observed: ${snapshot.pageTitle}`] : []),
          'visible page content is too limited to support a meaningful evaluation',
        ]),
      };
    }

    const booking = detectBookingPresence(snapshot);
    const scale = detectBusinessScale(snapshot);
    const contact = detectContactClarity(snapshot, scale.value);
    const trust = detectTrustSignalStrength(snapshot);
    const relevance = detectLocalRelevance(lead, snapshot);
    const fit = detectOutreachFit(scale.value, relevance.value);

    const confidence = detectConfidence(
      booking.value,
      trust.value,
      relevance.value,
      relevance.leadContextComplete,
      booking.directEvidence,
    );

    const evidence = dedupeEvidence([
      ...booking.evidence,
      ...contact.evidence,
      ...trust.evidence,
      ...scale.evidence,
      ...relevance.evidence,
      `outreach fit reasoning: ${fit.reason}`,
      `signal confidence assessed as: ${confidence}`,
    ]);

    return {
      bookingPresence: booking.value,
      contactClarity: contact.value,
      trustSignalStrength: trust.value,
      businessScale: scale.value,
      localRelevance: relevance.value,
      outreachFit: fit.value,
      fitReason: fit.reason,
      confidence,
      leadCompleteness: lead.completeness,
      issuesDetected: buildIssuesDetected(
        booking.value,
        contact.value,
        trust.value,
        scale.value,
        relevance.value,
        fit.value,
      ),
      evidence,
    };
  }
}