import type {
  GenerateOutreachInput,
  GeneratedOutreachDraft,
  OutreachGenerator,
} from '@signalscout/core';

const hasTrustSignal = (
  input: GenerateOutreachInput,
  signal: string,
): boolean => input.snapshot.trustSignals.includes(signal);

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

const buildGoodLeadFitReason = (): string => {
  return 'The lead is strongly aligned with the current local-practice outreach strategy and shows enough real commercial signal to justify a send-ready draft.';
};

const buildGoodLeadBestAngle = (): string => {
  return 'Lead with the gap between strong trust-building and a more decisive booking case.';
};

const buildGoodLeadSubject = (input: GenerateOutreachInput): string => {
  if (
    hasTrustSignal(input, 'mentions long tradition') ||
    hasTrustSignal(input, 'mentions family-led practice')
  ) {
    return `Quick thought on booking at ${input.lead.companyName}`;
  }

  return `Quick thought on ${input.lead.companyName}`;
};

const buildGoodLeadBody = (input: GenerateOutreachInput): string => {
  const { lead, snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;

  const hasTradition =
    hasTrustSignal(input, 'mentions long tradition') ||
    mentionsLongTradition(combinedText);
  const hasFamily =
    hasTrustSignal(input, 'mentions family-led practice') ||
    mentionsFamilyPositioning(combinedText);
  const hasComfort =
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(combinedText);

  if (hasTradition || hasFamily || hasComfort) {
    const trustCue =
      hasTradition && hasFamily
        ? 'the long-standing local presence and family feel'
        : hasTradition
          ? 'the long-standing local presence'
          : hasFamily
            ? 'the family feel'
            : 'the reassurance on the page';

    return `Hi,

I took a quick look at ${lead.companyName}. The site already builds a lot of trust, especially around ${trustCue}.

My main thought is that the step from reassurance to booking still feels a little softer than it should.

So someone who already feels good about the practice may still not get pushed quite enough to book.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`;
  }

  return `Hi,

I took a quick look at ${lead.companyName}. The site already feels credible, but the step from trust to booking could be more direct.

That usually means some interested visitors are probably hesitating a bit longer than they should before taking the next step.

If useful, I can send over 2 or 3 specific changes I'd test first.

Best,
[Your Name]`;
};

const buildGoodLeadReasoning = (input: GenerateOutreachInput): string => {
  const { snapshot } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;

  if (
    hasTrustSignal(input, 'mentions long tradition') ||
    hasTrustSignal(input, 'mentions family-led practice') ||
    mentionsLongTradition(combinedText) ||
    mentionsFamilyPositioning(combinedText)
  ) {
    return 'The draft uses a specific, credible angle: the practice has strong trust-building material, but that strength is described more than it is converted into booking momentum. That makes the message more specific and more commercially relevant than a generic booking-friction pitch.';
  }

  return 'The draft is built around a real commercial angle: existing credibility appears stronger than the page push toward action. That makes the outreach feel more grounded than a generic performance or marketing message.';
};

const buildGoodLeadEvidence = (input: GenerateOutreachInput): string[] => {
  const { snapshot, audit } = input;
  const combinedText = `${snapshot.pageTitle ?? ''} ${snapshot.metaDescription ?? ''} ${snapshot.visibleText}`;
  const evidence: string[] = [];

  if (snapshot.bookingLinks[0]) {
    evidence.push(`A direct booking path is already present: ${snapshot.bookingLinks[0]}`);
  }

  if (
    hasTrustSignal(input, 'mentions long tradition') ||
    hasTrustSignal(input, 'mentions local legacy') ||
    mentionsLongTradition(combinedText)
  ) {
    evidence.push('A 50+ year local tradition is explicitly mentioned on the site.');
  }

  if (
    hasTrustSignal(input, 'mentions family-led practice') ||
    mentionsFamilyPositioning(combinedText)
  ) {
    evidence.push('The practice is presented in family-led terms, which is a meaningful trust asset.');
  }

  if (
    hasTrustSignal(input, 'mentions patient comfort') ||
    hasTrustSignal(input, 'mentions anxiety-patient reassurance') ||
    mentionsComfortReassurance(combinedText)
  ) {
    evidence.push('The messaging strongly emphasizes reassurance, comfort, and patient-friendly care.');
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
  return `A quick thought on booking flow at ${lead.companyName}`;
};

const buildGeneralSendBody = (input: GenerateOutreachInput): string => {
  const { lead } = input;

  return `Hi,

I took a quick look at ${lead.companyName}, and one thing stood out: the path from interest to booking may be doing a little more work than it needs to.

When someone is already ready to act, even a small amount of extra friction can be enough to slow that moment down.

If helpful, I can share a short perspective on where that path may be less direct than it could be.

Best,
[Your Name]`;
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

export class MockOutreachGenerator implements OutreachGenerator {
  async generate(
    input: GenerateOutreachInput,
  ): Promise<GeneratedOutreachDraft> {
    const { signals, snapshot } = input;

    if (snapshot.isPlaceholderContent) {
      return buildPlaceholderOutreach(input);
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

    if (signals.outreachFit === 'uncertain') {
      return {
        recommendation: 'review',
        fitReason: buildReviewFitReason(),
        bestAngle: buildReviewBestAngle(),
        subject: `A quick thought on booking flow at ${input.lead.companyName}`,
        body: `Hi,

I came across ${input.lead.companyName}, and one thing stood out: the path from interest to booking may be less direct than it needs to be.

When that happens, even motivated visitors can hesitate simply because the next step is not obvious enough.

If useful, I can share a short perspective on where that friction may be showing up.

Best,
[Your Name]`,
        reasoning: buildReviewReasoning(),
        evidence: buildReviewEvidence(input),
      };
    }

    if (signals.outreachFit === 'good') {
      return {
        recommendation: 'send',
        fitReason: buildGoodLeadFitReason(),
        bestAngle: buildGoodLeadBestAngle(),
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
