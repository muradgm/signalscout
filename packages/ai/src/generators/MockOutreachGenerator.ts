import type {
  GenerateOutreachInput,
  GeneratedOutreachDraft,
  OutreachGenerator,
} from '@signalscout/core';

const buildDoNotSendFitReason = (input: GenerateOutreachInput): string => {
  const { signals } = input;

  if (
    signals.businessScale === 'large_chain' &&
    signals.localRelevance === 'low_match'
  ) {
    return 'This lead looks more like a scaled network than a locally aligned practice, so it falls outside the strongest fit for the current outreach wedge.';
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

  if (
    signals.businessScale === 'large_chain' &&
    signals.localRelevance === 'low_match'
  ) {
    return 'The business operates at a scale and geographic profile that do not match the current campaign focus. Generating a send-ready message here would create activity without a strong reason to expect a useful outcome.';
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
      `The page title reinforces a broad multi-location positioning: ${snapshot.pageTitle}`,
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

const buildReviewFitReason = (): string => {
  return 'The lead shows some alignment, but the fit is not yet strong enough to justify fully automated outreach without a human check.';
};

const buildReviewBestAngle = (): string => {
  return 'Lead with booking clarity and a simpler path from intent to action.';
};

const buildReviewReasoning = (): string => {
  return 'The lead is directionally relevant, but still ambiguous enough that a human should confirm the angle and wording before anything is sent.';
};

const buildReviewEvidence = (input: GenerateOutreachInput): string[] => {
  const { signals, snapshot } = input;
  const evidence: string[] = [];

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

  if (snapshot.metaDescription) {
    evidence.push(
      `The site messaging emphasizes availability and reach: ${snapshot.metaDescription}`,
    );
  }

  return [...new Set(evidence)].slice(0, 5);
};

const buildSendFitReason = (): string => {
  return 'The lead is aligned enough with the current outreach strategy to justify a send-ready draft built around one clear conversion angle.';
};

const buildSendBestAngle = (): string => {
  return 'Lead with booking-path clarity and reduced friction at the point where a visitor is ready to act.';
};

const buildSendSubject = (input: GenerateOutreachInput): string => {
  const { lead } = input;
  return `A quick thought on booking flow at ${lead.companyName}`;
};

const buildSendBody = (input: GenerateOutreachInput): string => {
  const { lead } = input;

  return `Hi,

I took a quick look at ${lead.companyName}, and one thing stood out: the path from interest to booking may be doing a little more work than it needs to.

When someone is already ready to act, even a small amount of extra friction can be enough to slow that moment down.

If helpful, I can share a short perspective on where that path may be less direct than it could be.

Best,
[Your Name]`;
};

const buildSendReasoning = (): string => {
  return 'The draft stays focused on one credible angle—booking-path clarity—rather than broad marketing language. That makes it more specific, more believable, and more likely to feel relevant to the recipient.';
};

const buildSendEvidence = (input: GenerateOutreachInput): string[] => {
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

export class MockOutreachGenerator implements OutreachGenerator {
  async generate(
    input: GenerateOutreachInput,
  ): Promise<GeneratedOutreachDraft> {
    const { signals, lead } = input;

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

    if (signals.outreachFit === 'uncertain') {
      return {
        recommendation: 'review',
        fitReason: buildReviewFitReason(),
        bestAngle: buildReviewBestAngle(),
        subject: `A quick thought on booking flow at ${lead.companyName}`,
        body: `Hi,

I came across ${lead.companyName}, and one thing stood out: the path from interest to booking may be less direct than it needs to be.

When that happens, even motivated visitors can hesitate simply because the next step is not obvious enough.

If useful, I can share a short perspective on where that friction may be showing up.

Best,
[Your Name]`,
        reasoning: buildReviewReasoning(),
        evidence: buildReviewEvidence(input),
      };
    }

    return {
      recommendation: 'send',
      fitReason: buildSendFitReason(),
      bestAngle: buildSendBestAngle(),
      subject: buildSendSubject(input),
      body: buildSendBody(input),
      reasoning: buildSendReasoning(),
      evidence: buildSendEvidence(input),
    };
  }
}