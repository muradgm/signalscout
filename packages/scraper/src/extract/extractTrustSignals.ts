const normalizeText = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const TRUST_SIGNAL_RULES: Array<{ label: string; patterns: RegExp[] }> = [
  {
    label: 'mentions team',
    patterns: [
      /\bteam\b/,
      /\bunser team\b/,
      /\bour team\b/,
      /\barzte\b/,
      /\bdentists\b/,
      /\bspecialists\b/,
    ],
  },
  {
    label: 'mentions long tradition',
    patterns: [
      /\bseit uber \d+\s+jahren\b/,
      /\bseit \d+\s+jahren\b/,
      /\bover \d+\s+years\b/,
      /\bfor over \d+\s+years\b/,
      /\bmehr als \d+\s+jahre\b/,
      /\blong-standing\b/,
    ],
  },
  {
    label: 'mentions local legacy',
    patterns: [
      /\btradition\b/,
      /\blocal tradition\b/,
      /\bstandort hat tradition\b/,
      /\bseit uber \d+\s+jahren existiert\b/,
      /\beine der altesten ansassigen\b/,
      /\bestablished locally\b/,
    ],
  },
  {
    label: 'mentions family-led practice',
    patterns: [
      /\bfamily[- ]led\b/,
      /\bfamily practice\b/,
      /\bals vater und sohn\b/,
      /\bfather and son\b/,
      /\bfamilienzahnarzt\b/,
      /\bfamiliengefuhrt\b/,
      /\bfamiliengefuhrte\b/,
    ],
  },
  {
    label: 'mentions reviews',
    patterns: [
      /\breview\b/,
      /\breviews\b/,
      /\bbewertung\b/,
      /\bbewertungen\b/,
      /\bgoogle review\b/,
      /\bpatient review\b/,
    ],
  },
  {
    label: 'mentions testimonials',
    patterns: [
      /\btestimonial\b/,
      /\btestimonials\b/,
      /\bpatientenstimmen\b/,
      /\bpatient stories\b/,
    ],
  },
  {
    label: 'mentions certifications',
    patterns: [
      /\bcertified\b/,
      /\bcertification\b/,
      /\bzertifiziert\b/,
      /\bzertifizierung\b/,
      /\bquality standard\b/,
    ],
  },
  {
    label: 'mentions experience',
    patterns: [
      /\bsince\s+\d{4}\b/,
      /\bover\s+\d+\s+years\b/,
      /\bjahre erfahrung\b/,
      /\bseit\s+\d{4}\b/,
      /\bfounded in\b/,
    ],
  },
  {
    label: 'mentions emergency availability',
    patterns: [
      /\bemergency\b/,
      /\bnotfall\b/,
      /\bsame-day appointment\b/,
      /\b365 days\b/,
      /\b365 tage\b/,
    ],
  },
  {
    label: 'mentions patient volume',
    patterns: [
      /\bpatients\b/,
      /\bpatienten\b/,
      /\btreated over\b/,
      /\bmore than \d+[,.]?\d*\s+patients\b/,
      /\buber \d+[,.]?\d*\s+patienten\b/,
      /\bgenerationsubergreifend\b/,
    ],
  },
  {
    label: 'mentions multiple locations',
    patterns: [
      /\blocations\b/,
      /\bstandorte\b/,
      /\bover \d+\s+locations\b/,
      /\bmehr als \d+\s+standorte\b/,
      /\bnearby\b/,
    ],
  },
  {
    label: 'mentions advanced technology',
    patterns: [
      /\b3d\b/,
      /\bdigital impression\b/,
      /\bstate-of-the-art\b/,
      /\bmodern technology\b/,
      /\bcutting-edge\b/,
      /\bmodernste technik\b/,
      /\bneuester stand der technik\b/,
    ],
  },
  {
    label: 'mentions patient comfort',
    patterns: [
      /\bwohlbefinden\b/,
      /\bkomfort\b/,
      /\bwartezimmer\b/,
      /\bkinderecke\b/,
      /\berfrischungsgetranke\b/,
      /\baquarium\b/,
      /\bfeel comfortable\b/,
      /\bpatient comfort\b/,
    ],
  },
  {
    label: 'mentions anxiety-patient reassurance',
    patterns: [
      /\bangstpatienten\b/,
      /\bangste\b/,
      /\breassurance\b/,
      /\breassuring\b/,
      /\bschonende\b/,
      /\bschmerzfreie\b/,
      /\bgentle treatment\b/,
      /\bpain-free\b/,
    ],
  },
];

export const extractTrustSignals = (visibleText: string): string[] => {
  const normalizedText = normalizeText(visibleText);
  const signals = new Set<string>();

  for (const rule of TRUST_SIGNAL_RULES) {
    const matches = rule.patterns.some((pattern) => pattern.test(normalizedText));

    if (matches) {
      signals.add(rule.label);
    }
  }

  return [...signals];
};
