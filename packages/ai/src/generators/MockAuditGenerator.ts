import type {
  AuditGenerator,
  GenerateAuditInput,
  GeneratedAuditDraft,
} from '@signalscout/core';

const buildPlaceholderAudit = (
  input: GenerateAuditInput,
): GeneratedAuditDraft => {
  const { lead, snapshot } = input;

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
      'Visible page content is too limited to support a meaningful evaluation.',
      ...(snapshot.contactInfo.emails.length > 0
        ? [`Only limited contact content was visible, including: ${snapshot.contactInfo.emails[0]}`]
        : []),
    ],
  };
};

const mentionsLongTradition = (text: string): boolean => {
  return /seit über 50 jahren|over 50 years|seit 50 jahren/i.test(text);
};

const mentionsFamilyPositioning = (text: string): boolean => {
  return /als vater und sohn|father and son|famil/i.test(text);
};

const mentionsComfortReassurance = (text: string): boolean => {
  return /wohlbefinden|angstpatienten|schonende|schmerzfreie|kinderecke|aquarium/i.test(
    text,
  );
};

const buildGoodLeadSummary = (input: GenerateAuditInput): string => {
  const { lead, snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;

  const hasTradition = mentionsLongTradition(combinedText);
  const hasFamily = mentionsFamilyPositioning(combinedText);

  if (hasTradition || hasFamily) {
    return `${lead.companyName} has a credible local presence with direct booking and strong trust foundations. Its family-led, long-standing positioning is a real asset, but that trust is described more than it is converted into a decisive booking case.`;
  }

  return `${lead.companyName} has a credible local presence with a direct booking path and clear contact options. The strongest commercial opportunity is less about adding trust and more about turning existing credibility into a more decisive conversion experience.`;
};

const buildGoodLeadStrengths = (input: GenerateAuditInput): string[] => {
  const { snapshot, signals } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
  const strengths: string[] = [];

  if (signals.bookingPresence === 'direct') {
    strengths.push('Direct booking is already available.');
  }

  if (signals.contactClarity === 'high') {
    strengths.push('Contact options are clear and easy to find.');
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

  return [...new Set(strengths)].slice(0, 5);
};

const buildGoodLeadOpportunities = (input: GenerateAuditInput): string[] => {
  const { snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
  const opportunities: string[] = [];

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    opportunities.push('Strong trust assets are present, but they are not turned into a decisive enough booking case.');
  }

  if (mentionsComfortReassurance(combinedText)) {
    opportunities.push('Patient reassurance is strong, but it is not carried forcefully enough into the decision to book.');
  }

  if (opportunities.length === 0) {
    opportunities.push('The site could guide visitors from confidence to booking more decisively.');
  }

  return [...new Set(opportunities)].slice(0, 3);
};

const buildGoodLeadOpportunityDetails = (
  input: GenerateAuditInput,
): string[] => {
  const { snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
  const details: string[] = [];

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
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    return 'Lead with the gap between strong trust-building and decisive booking momentum: the site already feels credible, but it could convert that trust into action more deliberately.';
  }

  return 'Lead with how existing credibility could be turned into a sharper, more decisive path from reassurance to booking.';
};

const buildGoodLeadConfidenceNote = (input: GenerateAuditInput): string => {
  const { lead } = input;

  if (lead.completeness !== 'complete') {
    return 'Confidence is medium: the website content is strong enough for a grounded read, though incomplete lead metadata still limits precision slightly.';
  }

  return 'Confidence is medium to high: the website provides enough real content to support a grounded commercial assessment.';
};

const buildGoodLeadQuickWins = (input: GenerateAuditInput): string[] => {
  const { snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
  const quickWins: string[] = [
    'Make the primary booking action more prominent above the fold.',
    'Turn the main trust claim into a clearer reason to book now.',
  ];

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    quickWins.push('Use the long-standing family-led positioning directly beside the main booking call to action.');
  }

  if (mentionsComfortReassurance(combinedText)) {
    quickWins.push('Connect reassurance messaging more explicitly to the next booking step.');
  }

  return [...new Set(quickWins)].slice(0, 3);
};

const buildGoodLeadOutreachHook = (input: GenerateAuditInput): string => {
  const { snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;

  if (mentionsLongTradition(combinedText) || mentionsFamilyPositioning(combinedText)) {
    return 'The site already feels trustworthy and established; the opportunity is to convert that credibility into a more decisive booking moment.';
  }

  return 'The site already has credibility, but the conversion path could make the next step feel more obvious and immediate.';
};

const buildGoodLeadEvidence = (input: GenerateAuditInput): string[] => {
  const { snapshot, signals } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
  const evidence: string[] = [];

  if (signals.bookingPresence === 'direct' && snapshot.bookingLinks[0]) {
    evidence.push(`Direct booking link found: ${snapshot.bookingLinks[0]}`);
  }

  if (signals.contactClarity === 'high') {
    evidence.push('Contact options are clearly visible on the page.');
  }

  if (signals.localRelevance === 'high_match') {
    evidence.push('The site strongly reflects the local market context, including Berlin and Prenzlauer Berg positioning.');
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

  return [...new Set(evidence)].slice(0, 6);
};

const buildGeneralSummary = (input: GenerateAuditInput): string => {
  const { lead, signals } = input;

  if (signals.outreachFit === 'poor') {
    return `${lead.companyName} operates more like a large, multi-location dental network than a local practice. While booking intent and credibility are both visible, it is a weak match for a local conversion-focused outreach angle.`;
  }

  if (signals.bookingPresence === 'indirect') {
    return `${lead.companyName} shows clear booking intent, but the path from interest to action is not especially direct. That likely introduces avoidable friction in the conversion journey.`;
  }

  if (signals.bookingPresence === 'not_detected') {
    return `${lead.companyName} has a visible online presence, but no clear booking path was detected. That gap may be limiting conversion from otherwise interested visitors.`;
  }

  return `${lead.companyName} presents a credible online presence, though the strongest commercial opportunity still needs human review before a sharper recommendation can be made.`;
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
    evidence.push(
      'The site presents the business as a large multi-location network rather than a single local practice.',
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
