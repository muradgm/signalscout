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
  value
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-–—]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const countOccurrences = (text: string, patterns: RegExp[]): number => {
  return patterns.reduce((count, pattern) => {
    const matches = text.match(pattern);
    return count + (matches?.length ?? 0);
  }, 0);
};

const hasCompleteLeadContext = (lead: Lead): boolean => {
  return lead.completeness === 'complete';
};

type LocationProfile = {
  canonical: string;
  aliases: string[];
  districts: string[];
};

const LOCATION_REGISTRY: LocationProfile[] = [
  {
    canonical: 'berlin',
    aliases: ['berlin'],
    districts: [
      'prenzlauer berg',
      'mitte',
      'kreuzberg',
      'friedrichshain',
      'neukolln',
      'charlottenburg',
      'wilmersdorf',
      'schoneberg',
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
      'kopenick',
      'treptow',
    ],
  },
  {
    canonical: 'hamburg',
    aliases: ['hamburg'],
    districts: [
      'altona',
      'eimsbuttel',
      'winterhude',
      'wandsbek',
      'harburg',
      'barmbek',
      'blankenese',
      'st pauli',
      'ottensen',
      'eppendorf',
    ],
  },
  {
    canonical: 'munich',
    aliases: ['munich', 'munchen', 'muenchen'],
    districts: ['schwabing', 'bogenhausen', 'haidhhausen', 'sendling', 'neuhausen'],
  },
  {
    canonical: 'cologne',
    aliases: ['cologne', 'koln', 'koeln'],
    districts: ['ehrenfeld', 'lindenthal', 'deutz', 'nippes', 'sulz'],
  },
  {
    canonical: 'frankfurt',
    aliases: ['frankfurt', 'frankfurt am main'],
    districts: ['sachsenhausen', 'bornheim', 'niederrad', 'westend', 'bockenheim'],
  },
  {
    canonical: 'stuttgart',
    aliases: ['stuttgart'],
    districts: ['vaihingen', 'bad cannstatt', 'degeloch', 'zuffenhausen', 'feuerbach'],
  },
  {
    canonical: 'dusseldorf',
    aliases: ['dusseldorf', 'duesseldorf'],
    districts: ['unterbilk', 'oberkassel', 'bilk', 'pempelfort', 'gerresheim', 'flingern'],
  },
  {
    canonical: 'nurnberg',
    aliases: ['nurnberg', 'nuernberg', 'nuremberg'],
    districts: ['gostenhof', 'langwasser', 'st johannis', 'sudstadt', 'maxfeld'],
  },
  {
    canonical: 'leipzig',
    aliases: ['leipzig'],
    districts: ['plagwitz', 'connewitz', 'gohlis', 'reudnitz', 'zentrum sud'],
  },
  {
    canonical: 'dresden',
    aliases: ['dresden'],
    districts: ['neustadt', 'blasewitz', 'plauen', 'loschwitz', 'pieschen'],
  },
  {
    canonical: 'wiesbaden',
    aliases: ['wiesbaden'],
    districts: ['bierstadt', 'schierstein', 'sonnenberg', 'klarenthal'],
  },
  {
    canonical: 'mainz',
    aliases: ['mainz'],
    districts: ['gonsenheim', 'hechtsheim', 'finthen', 'mombach'],
  },
  {
    canonical: 'bremen',
    aliases: ['bremen'],
    districts: ['schwachhausen', 'vegesack', 'neustadt', 'findorff'],
  },
  {
    canonical: 'essen',
    aliases: ['essen'],
    districts: ['ruttenscheid', 'werden', 'borbeck', 'kupferdreh'],
  },
  {
    canonical: 'bochum',
    aliases: ['bochum'],
    districts: ['wattenscheid', 'langendreer', 'stiepel', 'hamme'],
  },
  {
    canonical: 'mannheim',
    aliases: ['mannheim'],
    districts: ['neckarstadt', 'lindenhof', 'schwetzingerstadt'],
  },
  {
    canonical: 'karlsruhe',
    aliases: ['karlsruhe'],
    districts: ['durlach', 'muhlburg', 'sudstadt'],
  },
  {
    canonical: 'augsburg',
    aliases: ['augsburg'],
    districts: ['goggingen', 'pfersee', 'hochzoll'],
  },
  {
    canonical: 'hannover',
    aliases: ['hannover', 'hanover'],
    districts: ['list', 'linden', 'sudstadt', 'kirchrode', 'kleefeld'],
  },
  {
    canonical: 'bonn',
    aliases: ['bonn'],
    districts: ['bad godesberg', 'beuel', 'poppelsdorf', 'duisdorf'],
  },
  {
    canonical: 'freiburg',
    aliases: ['freiburg', 'freiburg im breisgau'],
    districts: ['stuhlinger', 'wiehre', 'herdern', 'vauban'],
  },
  {
    canonical: 'heidelberg',
    aliases: ['heidelberg'],
    districts: ['neuenheim', 'handschuhsheim', 'rohrbach', 'bergheim'],
  },
  {
    canonical: 'munster',
    aliases: ['munster', 'muenster', 'munster westfalen', 'muenster westfalen'],
    districts: ['kreuzviertel', 'hiltrup', 'gievenbeck', 'sentrup'],
  },
  {
    canonical: 'aachen',
    aliases: ['aachen'],
    districts: ['burtscheid', 'laurensberg', 'forst', 'eilendorf'],
  },
  {
    canonical: 'dortmund',
    aliases: ['dortmund'],
    districts: ['horde', 'hombruch', 'aplerbeck', 'kreuzviertel'],
  },
  {
    canonical: 'kiel',
    aliases: ['kiel'],
    districts: ['wik', 'gaarden', 'holtenau', 'dusternbrook'],
  },
  {
    canonical: 'darmstadt',
    aliases: ['darmstadt'],
    districts: ['eberstadt', 'bessungen', 'arheilgen', 'martinsviertel'],
  },
  {
    canonical: 'regensburg',
    aliases: ['regensburg'],
    districts: ['kumpfmuhl', 'kumpfmuehl', 'schwabelweis', 'steinweg', 'innerer westen'],
  },
  {
    canonical: 'ulm',
    aliases: ['ulm'],
    districts: ['safranberg', 'bofingen', 'eselsberg', 'wiblingen'],
  },
  {
    canonical: 'rostock',
    aliases: ['rostock'],
    districts: ['warnemunde', 'warnemuende', 'kropeliner tor vorstadt', 'reutershagen'],
  },
  {
    canonical: 'koblenz',
    aliases: ['koblenz', 'coblenz'],
    districts: ['metternich', 'ehrenbreitstein', 'moselweiss'],
  },
];

const LOCATION_DELIMITER_PATTERN = /[,/|()\-]+/g;
const POSTAL_CITY_PATTERN = /\b\d{5}\s+([a-z][a-z\s-]{1,60})\b/gi;
const ADMIN_LOCATION_SUFFIXES = [
  ' am main',
  ' im breisgau',
  ' an der lahn',
  ' an der weser',
  ' an der donau',
  ' westfalen',
];

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createPhrasePattern = (phrase: string): RegExp =>
  new RegExp(`(^|[^a-z0-9])${escapeRegExp(phrase)}([^a-z0-9]|$)`, 'i');

const LOCATION_PROFILE_BY_ALIAS = new Map<string, LocationProfile>();

const buildSpellingVariants = (value: string): string[] => {
  const variants = new Set<string>([value]);
  const queue = [value];
  const replacements = [
    ['ae', 'a'],
    ['oe', 'o'],
    ['ue', 'u'],
  ] as const;

  while (queue.length > 0) {
    const current = queue.shift() ?? '';

    for (const [source, target] of replacements) {
      if (!current.includes(source)) {
        continue;
      }

      const variant = current.replaceAll(source, target);

      if (!variants.has(variant)) {
        variants.add(variant);
        queue.push(variant);
      }
    }
  }

  return [...variants];
};

const buildAdministrativeVariants = (value: string): string[] => {
  const variants = new Set<string>([value]);

  for (const suffix of ADMIN_LOCATION_SUFFIXES) {
    if (value.endsWith(suffix)) {
      const trimmed = value.slice(0, -suffix.length).trim();

      if (trimmed.length >= 3) {
        variants.add(trimmed);
      }
    }
  }

  return [...variants];
};

const buildAllLocationVariants = (value: string): string[] => {
  const normalizedValue = normalize(value);

  if (!normalizedValue) {
    return [];
  }

  const variants = new Set<string>();

  for (const spellingVariant of buildSpellingVariants(normalizedValue)) {
    for (const administrativeVariant of buildAdministrativeVariants(spellingVariant)) {
      if (administrativeVariant.length >= 3) {
        variants.add(administrativeVariant);
      }
    }
  }

  return [...variants];
};

for (const profile of LOCATION_REGISTRY) {
  for (const alias of new Set([profile.canonical, ...profile.aliases])) {
    for (const variant of buildAllLocationVariants(alias)) {
      LOCATION_PROFILE_BY_ALIAS.set(variant, profile);
    }
  }
}

const LOCATION_FOOTPRINT_PATTERNS = LOCATION_REGISTRY.map((profile) => ({
  canonical: profile.canonical,
  patterns: [...new Set([profile.canonical, ...profile.aliases])]
    .flatMap((alias) => buildAllLocationVariants(alias))
    .map((alias) => createPhrasePattern(alias)),
}));

const containsPhrase = (text: string, phrase: string): boolean => {
  if (!phrase) {
    return false;
  }

  const pattern = createPhrasePattern(phrase);
  return pattern.test(text);
};

const addEmbeddedProfileMatches = (candidates: Set<string>, rawValue: string): void => {
  const normalizedValue = normalize(rawValue);

  if (normalizedValue.length < 3) {
    return;
  }

  for (const profile of LOCATION_REGISTRY) {
    for (const alias of [profile.canonical, ...profile.aliases, ...profile.districts]) {
      for (const variant of buildAllLocationVariants(alias)) {
        if (variant.length >= 3 && containsPhrase(normalizedValue, variant)) {
          candidates.add(variant);
        }
      }
    }
  }
};

const addLocationVariants = (candidates: Set<string>, rawValue: string): void => {
  for (const normalizedValue of buildAllLocationVariants(rawValue)) {
    if (normalizedValue.length < 3) {
      continue;
    }

    candidates.add(normalizedValue);

    const profile = LOCATION_PROFILE_BY_ALIAS.get(normalizedValue);

    if (!profile) {
      continue;
    }

    for (const value of [profile.canonical, ...profile.aliases, ...profile.districts]) {
      for (const normalizedVariant of buildAllLocationVariants(value)) {
        if (normalizedVariant.length >= 3) {
          candidates.add(normalizedVariant);
        }
      }
    }
  }

  addEmbeddedProfileMatches(candidates, rawValue);
};

const splitLocationFragments = (value: string): string[] => {
  return value
    .split(LOCATION_DELIMITER_PATTERN)
    .map((fragment) => normalize(fragment))
    .filter((fragment) => fragment.length >= 3);
};

const extractAddressLocationCandidates = (snapshot: LeadSnapshot): string[] => {
  const candidates = new Set<string>();

  for (const address of snapshot.contactInfo.addresses) {
    const normalizedAddress = normalize(address);

    for (const fragment of splitLocationFragments(normalizedAddress)) {
      addLocationVariants(candidates, fragment);
    }

    for (const match of normalizedAddress.matchAll(POSTAL_CITY_PATTERN)) {
      const cityFragment = normalize(match[1] ?? '');

      if (cityFragment.length >= 3) {
        addLocationVariants(candidates, cityFragment);

        for (const subFragment of splitLocationFragments(cityFragment)) {
          addLocationVariants(candidates, subFragment);
        }
      }
    }
  }

  return [...candidates];
};

const buildLocationCandidates = (location: string): string[] => {
  const normalizedLocation = normalize(location);

  if (!normalizedLocation) {
    return [];
  }

  const candidates = new Set<string>();

  addLocationVariants(candidates, normalizedLocation);

  for (const fragment of splitLocationFragments(normalizedLocation)) {
    addLocationVariants(candidates, fragment);
  }

  return [...candidates];
};

const countDistinctLocationFootprints = (text: string): number => {
  const matches = new Set<string>();

  for (const footprint of LOCATION_FOOTPRINT_PATTERNS) {
    if (footprint.patterns.some((pattern) => pattern.test(text))) {
      matches.add(footprint.canonical);
    }
  }

  return matches.size;
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

  if (count >= 3) {
    return { value: 'high', evidence };
  }

  if (count >= 1) {
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

  const networkMentions = countOccurrences(text, [
    /\bpraxisnetz\b/gi,
    /\bnetz\b/gi,
    /\bnetwork\b/gi,
    /\bmvz\b/gi,
    /\bversorgungszentrum\b/gi,
    /\bzahnzentrum\b/gi,
    /\bmedical board\b/gi,
    /\bgeschaftsleitung\b/gi,
    /\bunternehmen\b/gi,
    /\bstandortleitung\b/gi,
  ]);

  const cityFootprintMentions = countDistinctLocationFootprints(text);

  if (
    numericLocationMentions >= 1 ||
    multiLocationMentions >= 5 ||
    cityFootprintMentions >= 4 ||
    (networkMentions >= 2 && cityFootprintMentions >= 2)
  ) {
    evidence.push('site presents itself as a multi-location network at large scale');
    evidence.push(
      `location-network evidence found (${multiLocationMentions} general mentions, ${numericLocationMentions} explicit count mentions, ${networkMentions} network mentions, ${cityFootprintMentions} distinct city mentions)`,
    );

    return { value: 'large_chain', evidence };
  }

  if (
    multiLocationMentions >= 1 ||
    networkMentions >= 1 ||
    snapshot.trustSignals.includes('mentions multiple locations')
  ) {
    evidence.push('site shows evidence of operating across multiple locations or a wider network');

    return { value: 'multi_location', evidence };
  }

  evidence.push('no strong multi-location evidence detected');

  return { value: 'single_location', evidence };
};

const detectLocalRelevance = (
  lead: Lead,
  snapshot: LeadSnapshot,
): { value: LocalRelevance; evidence: string[]; leadContextComplete: boolean } => {
  const pageText = normalize(
    `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`,
  );

  const evidence: string[] = [];
  const location = normalize(lead.location ?? '');
  const country = normalize(lead.country ?? '');

  const leadContextComplete = hasCompleteLeadContext(lead);

  const locationCandidates = buildLocationCandidates(location);
  const addressCandidates = extractAddressLocationCandidates(snapshot);

  const matchedAddressCandidate =
    locationCandidates.find((candidate) =>
      addressCandidates.some((addressCandidate) => containsPhrase(addressCandidate, candidate)),
    ) ?? null;

  const matchedPageCandidate =
    locationCandidates.find((candidate) => containsPhrase(pageText, candidate)) ?? null;

  const matchedLocationCandidate = matchedAddressCandidate ?? matchedPageCandidate;
  const locationMatch = matchedLocationCandidate !== null;
  const countryMatch = country.length > 0 && containsPhrase(pageText, country);
  const hasAddressLevelSupport = matchedAddressCandidate !== null;

  if (!lead.location?.trim()) {
    evidence.push('lead location is missing');
  } else if (matchedAddressCandidate) {
    if (matchedAddressCandidate === location) {
      evidence.push(
        `high-quality location evidence: lead location appears in extracted contact/address data: ${lead.location}`,
      );
    } else {
      evidence.push(
        `high-quality location evidence: district or locality appears in extracted contact/address data: ${matchedAddressCandidate}`,
      );
    }
  } else if (matchedPageCandidate) {
    if (matchedPageCandidate === location) {
      evidence.push(
        `moderate-quality location evidence: lead location appears in site content: ${lead.location}`,
      );
    } else {
      evidence.push(
        `moderate-quality location evidence: district or locality appears in site content: ${matchedPageCandidate}`,
      );
    }
  } else if (locationCandidates.length > 0) {
    evidence.push(
      `lead location does not appear in site content or extracted addresses: ${lead.location}`,
    );
  } else {
    evidence.push('lead location could not be expanded into usable match candidates');
  }

  if (!lead.country?.trim()) {
    evidence.push('lead country is missing');
  } else {
    evidence.push(
      countryMatch
        ? `country evidence present in site content: ${lead.country}`
        : `country evidence not found in site content: ${lead.country}`,
    );
  }

  if (locationMatch && hasAddressLevelSupport) {
    return {
      value: 'high_match',
      evidence,
      leadContextComplete,
    };
  }

  if (
    locationMatch &&
    matchedLocationCandidate === location &&
    (countryMatch || !lead.country?.trim())
  ) {
    return {
      value: 'high_match',
      evidence,
      leadContextComplete,
    };
  }

  if (locationMatch && matchedPageCandidate !== null && matchedLocationCandidate !== location) {
    return {
      value: 'high_match',
      evidence,
      leadContextComplete,
    };
  }

  if (locationMatch && matchedPageCandidate !== null && countryMatch) {
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
  bookingPresence: BookingPresence,
  contactClarity: ContactClarity,
  trustSignalStrength: TrustSignalStrength,
  localRelevance: LocalRelevance,
  leadContextComplete: boolean,
): { value: OutreachFit; reason: string } => {
  if (businessScale === 'large_chain' || businessScale === 'multi_location') {
    return {
      value: 'poor',
      reason:
        localRelevance === 'high_match'
          ? 'The lead appears to be a larger network brand, which falls outside the intended small-practice outreach wedge even when the local page is relevant.'
          : 'The lead appears to be a larger network brand with weak geographic alignment to the intended local-market offer.',
    };
  }

  if (businessScale === 'single_location' && localRelevance === 'high_match') {
    return {
      value: 'good',
      reason:
        'The lead appears locally aligned and structurally close to the intended single-practice offer.',
    };
  }

  if (
    businessScale === 'single_location' &&
    localRelevance === 'partial_match' &&
    leadContextComplete
  ) {
    return {
      value: 'good',
      reason:
        'The lead appears structurally close to the intended single-practice offer, and the complete lead context keeps a narrower local match credible enough for outreach.',
    };
  }

  if (
    businessScale === 'single_location' &&
    leadContextComplete &&
    bookingPresence !== 'not_detected' &&
    contactClarity !== 'low' &&
    trustSignalStrength !== 'low'
  ) {
    return {
      value: 'good',
      reason:
        'The lead appears to be a complete, single-practice opportunity with usable booking, contact, and trust signals, even though the geographic reinforcement is weaker than the strongest cases.',
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
    const fit = detectOutreachFit(
      scale.value,
      booking.value,
      contact.value,
      trust.value,
      relevance.value,
      relevance.leadContextComplete,
    );

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
