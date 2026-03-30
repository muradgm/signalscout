import type {
  AuditGenerator,
  GenerateAuditInput,
  GeneratedAuditDraft,
} from '@signalscout/core';

const buildSummary = (input: GenerateAuditInput): string => {
  const { lead, signals } = input;

  if (signals.outreachFit === 'poor') {
    return `${lead.companyName} operates more like a large, multi-location dental network than a local practice. While booking intent and credibility are both visible, it is a weak match for a local conversion-focused outreach angle.`;
  }

  if (signals.bookingPresence === 'indirect') {
    return `${lead.companyName} shows clear booking intent, but the path from interest to action is not especially direct. That likely adds unnecessary friction to the conversion journey.`;
  }

  if (signals.bookingPresence === 'not_detected') {
    return `${lead.companyName} has a visible online presence, but no clear booking path was detected. That gap may be limiting action from otherwise interested visitors.`;
  }

  return `${lead.companyName} presents a credible online presence with a usable booking flow, although there are still signs that conversion clarity could be improved.`;
};

const buildStrengths = (input: GenerateAuditInput): string[] => {
  const { signals, snapshot } = input;
  const strengths: string[] = [];

  if (signals.trustSignalStrength === 'high') {
    strengths.push(
      'Multiple trust cues are visible across the site.',
    );
  }

  if (signals.contactClarity === 'high') {
    strengths.push(
      'The contact path looks clear and easy to follow.',
    );
  } else if (signals.contactClarity === 'medium') {
    strengths.push(
      'Users can find several ways to contact the business.',
    );
  }

  if (signals.businessScale === 'large_chain') {
    strengths.push(
      'The site clearly presents the business at meaningful scale.',
    );
  }

  if (snapshot.trustSignals.length > 0) {
    const trustExamples = snapshot.trustSignals.slice(0, 2).join(' and ');
    strengths.push(
      `Visible trust cues include ${trustExamples}.`,
    );
  }

  return [...new Set(strengths)].slice(0, 3);
};

const buildOpportunities = (input: GenerateAuditInput): string[] => {
  const { signals } = input;
  const opportunities: string[] = [];

  if (signals.bookingPresence === 'indirect') {
    opportunities.push('Booking path feels indirect');
  }

  if (signals.bookingPresence === 'not_detected') {
    opportunities.push('Booking path is not clearly visible');
  }

  if (signals.localRelevance !== 'high_match') {
    opportunities.push('Lead targeting looks misaligned');
  }

  if (signals.contactClarity === 'medium') {
    opportunities.push('Contact flow looks broad rather than guided');
  }

  return [...new Set(opportunities)].slice(0, 3);
};

const buildOpportunityDetails = (input: GenerateAuditInput): string[] => {
  const { signals } = input;
  const details: string[] = [];

  if (signals.bookingPresence === 'indirect') {
    details.push(
      'Users likely encounter extra steps, location choices, or navigation decisions before they reach a booking action. That delay can weaken commitment at the point where conversion should feel easiest.',
    );
  }

  if (signals.bookingPresence === 'not_detected') {
    details.push(
      'A visible booking route does not stand out clearly. That may reduce the number of visitors who move from interest to action.',
    );
  }

  if (signals.localRelevance !== 'high_match') {
    details.push(
      'This lead does not align cleanly with the intended local targeting strategy. Time spent here is likely to produce lower returns than focusing on practices that more clearly match the local market position.',
    );
  }

  if (signals.contactClarity === 'medium') {
    details.push(
      'The contact surface looks broad rather than deliberately guided. That can make the experience feel administrative rather than action-oriented, especially for users who want one obvious next step.',
    );
  }

  return [...new Set(details)].slice(0, 3);
};

const buildRisks = (input: GenerateAuditInput): string[] => {
  const { lead, signals } = input;
  const risks: string[] = [];

  if (lead.completeness !== 'complete') {
    risks.push(
      'Incomplete lead data lowers confidence in both targeting accuracy and fit assessment.',
    );
  }

  if (signals.businessScale === 'large_chain') {
    risks.push(
      'The scale of the business makes a small-practice or highly localized offer less naturally relevant.',
    );
  }

  if (signals.localRelevance === 'low_match') {
    risks.push(
      'The website content does not align closely with the lead’s recorded geography, which raises qualification concerns before outreach even begins.',
    );
  }

  if (signals.outreachFit === 'poor') {
    risks.push(
      'This lead is unlikely to convert under the current outreach wedge without a materially different positioning strategy.',
    );
  }

  return [...new Set(risks)].slice(0, 4);
};

const buildRecommendedAngle = (input: GenerateAuditInput): string => {
  const { signals } = input;

  if (signals.outreachFit === 'poor') {
    return 'Deprioritize this lead for the current campaign, or approach it only with a more strategic, higher-level positioning that fits a larger organization.';
  }

  if (signals.bookingPresence === 'indirect') {
    return 'Lead with booking-path clarity and conversion efficiency rather than broad marketing language.';
  }

  if (signals.bookingPresence === 'not_detected') {
    return 'Lead with the missed-conversion risk created by the absence of a clear booking path.';
  }

  return 'Lead with a focused conversion angle tied to ease of action and booking clarity.';
};

const buildConfidenceNote = (input: GenerateAuditInput): string => {
  if (input.lead.completeness !== 'complete') {
    return 'Confidence is moderated by incomplete lead metadata, especially around geography and source context.';
  }

  if (input.signals.bookingPresence === 'indirect') {
    return 'Confidence is moderate because booking intent is visible, but the path itself is inferred rather than directly extracted.';
  }

  return 'Confidence is reasonably strong because the main conclusions are supported by multiple aligned signals.';
};

const buildEvidence = (input: GenerateAuditInput): string[] => {
  const evidence: string[] = [];

  if (input.snapshot.pageTitle) {
    evidence.push(
      `Page title suggests a multi-location positioning: ${input.snapshot.pageTitle}`,
    );
  }

  if (input.snapshot.metaDescription) {
    evidence.push(
      `Meta description emphasizes reach and availability: ${input.snapshot.metaDescription}`,
    );
  }

  if (input.signals.bookingPresence === 'indirect') {
    evidence.push(
      'Booking-related language is present, but no direct booking link was extracted.',
    );
  }

  if (input.signals.businessScale === 'large_chain') {
    evidence.push(
      'The site presents the business as a large multi-location network rather than a single local practice.',
    );
  }

  if (input.signals.localRelevance === 'low_match') {
    evidence.push(
      'The recorded lead location is not clearly reflected in the site content.',
    );
  }

  if (input.signals.trustSignalStrength === 'high') {
    evidence.push(
      'Multiple trust cues are visible, including team presence, emergency availability, and scale-related signals.',
    );
  }

  if (input.signals.contactClarity === 'medium') {
    evidence.push(
      'The contact surface is extensive, but it appears distributed rather than tightly guided.',
    );
  }

  return [...new Set(evidence)].slice(0, 8);
};

export class MockAuditGenerator implements AuditGenerator {
  async generate(input: GenerateAuditInput): Promise<GeneratedAuditDraft> {
    return {
      summary: buildSummary(input),
      strengths: buildStrengths(input),
      opportunities: buildOpportunities(input),
      opportunityDetails: buildOpportunityDetails(input),
      risks: buildRisks(input),
      recommendedAngle: buildRecommendedAngle(input),
      confidenceNote: buildConfidenceNote(input),
      evidence: buildEvidence(input),
    };
  }
}