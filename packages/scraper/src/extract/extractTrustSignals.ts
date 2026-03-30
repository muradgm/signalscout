const TRUST_SIGNAL_RULES: Array<{ label: string; patterns: RegExp[] }> = [
  {
    label: 'mentions team',
    patterns: [
      /\bteam\b/i,
      /\bunser team\b/i,
      /\bour team\b/i,
      /\bärzte\b/i,
      /\bdentists\b/i,
      /\bspecialists\b/i,
    ],
  },
  {
    label: 'mentions reviews',
    patterns: [
      /\breview\b/i,
      /\breviews\b/i,
      /\bbewertung\b/i,
      /\bbewertungen\b/i,
      /\bgoogle review\b/i,
      /\bpatient review\b/i,
    ],
  },
  {
    label: 'mentions testimonials',
    patterns: [
      /\btestimonial\b/i,
      /\btestimonials\b/i,
      /\bpatientenstimmen\b/i,
      /\bpatient stories\b/i,
    ],
  },
  {
    label: 'mentions certifications',
    patterns: [
      /\bcertified\b/i,
      /\bcertification\b/i,
      /\bzertifiziert\b/i,
      /\bzertifizierung\b/i,
      /\bquality standard\b/i,
    ],
  },
  {
    label: 'mentions experience',
    patterns: [
      /\bsince\s+\d{4}\b/i,
      /\bover\s+\d+\s+years\b/i,
      /\bjahre erfahrung\b/i,
      /\bseit\s+\d{4}\b/i,
      /\bfounded in\b/i,
    ],
  },
  {
    label: 'mentions emergency availability',
    patterns: [
      /\bemergency\b/i,
      /\bnotfall\b/i,
      /\bsame-day appointment\b/i,
      /\b365 days\b/i,
      /\b365 tage\b/i,
    ],
  },
  {
    label: 'mentions patient volume',
    patterns: [
      /\bpatients\b/i,
      /\bpatienten\b/i,
      /\btreated over\b/i,
      /\bmore than \d+[,.]?\d*\s+patients\b/i,
      /\büber \d+[,.]?\d*\s+patienten\b/i,
    ],
  },
  {
    label: 'mentions multiple locations',
    patterns: [
      /\blocations\b/i,
      /\bstandorte\b/i,
      /\bover \d+\s+locations\b/i,
      /\bmehr als \d+\s+standorte\b/i,
      /\bnearby\b/i,
    ],
  },
  {
    label: 'mentions advanced technology',
    patterns: [
      /\b3d\b/i,
      /\bdigital impression\b/i,
      /\bstate-of-the-art\b/i,
      /\bmodern technology\b/i,
      /\bcutting-edge\b/i,
      /\bmodernste technik\b/i,
    ],
  },
];

export const extractTrustSignals = (visibleText: string): string[] => {
  const normalizedText = visibleText.replace(/\s+/g, ' ').trim();
  const signals = new Set<string>();

  for (const rule of TRUST_SIGNAL_RULES) {
    const matches = rule.patterns.some((pattern) => pattern.test(normalizedText));

    if (matches) {
      signals.add(rule.label);
    }
  }

  return [...signals];
};