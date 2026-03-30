import type { GenerateOutreachInput } from '@signalscout/core';

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}…`;
};

export const buildOutreachPrompt = (input: GenerateOutreachInput): string => {
  const payload = {
    lead: {
      id: input.lead.id,
      companyName: input.lead.companyName,
      website: input.lead.website,
      niche: input.lead.niche,
      location: input.lead.location,
      country: input.lead.country ?? null,
      source: input.lead.source ?? null,
      completeness: input.lead.completeness,
    },
    snapshot: {
      id: input.snapshot.id,
      url: input.snapshot.url,
      pageTitle: input.snapshot.pageTitle,
      metaDescription: input.snapshot.metaDescription,
      visibleText: truncate(input.snapshot.visibleText, 6000),
      bookingLinks: input.snapshot.bookingLinks,
      trustSignals: input.snapshot.trustSignals,
      extractedAt: input.snapshot.extractedAt.toISOString(),
    },
    signals: input.signals,
    audit: {
      id: input.audit.id,
      summary: input.audit.summary,
      strengths: input.audit.strengths,
      opportunities: input.audit.opportunities,
      opportunityDetails: input.audit.opportunityDetails,
      risks: input.audit.risks,
      recommendedAngle: input.audit.recommendedAngle,
      confidenceNote: input.audit.confidenceNote,
      evidence: input.audit.evidence,
    },
  };

  return `
You are generating a grounded outreach draft for an opportunity-intelligence system.

Your job is to produce a concise, credible outreach draft that is consistent with the provided lead, snapshot, signals, and audit.

Rules:
1. Use only the information in the payload below.
2. Do not invent facts, claims, or promises.
3. Do not exaggerate urgency or certainty.
4. Write like a thoughtful human operator, not a generic sales bot.
5. Keep the message specific, restrained, and commercially relevant.

Return ONLY valid JSON with this exact shape:

{
  "channel": "email",
  "subject": "string",
  "body": "string",
  "reasoning": "string",
  "evidence": ["string"],
  "status": "drafted"
}

Guidance:
- subject: concise and specific
- body: natural, short, and relevant
- reasoning: why this angle was chosen
- evidence: short supporting statements tied to the payload
- status: always "drafted"

Payload:
${JSON.stringify(payload, null, 2)}
`.trim();
};