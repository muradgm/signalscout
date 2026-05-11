import type { GenerateOutreachInput } from '@signalscout/core';

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
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
You are generating a grounded outreach decision and draft for an opportunity-intelligence system.

Your job is to decide whether this lead should be sent, held for review, or not sent, then produce a concise, credible outreach draft when appropriate.

Rules:
1. Use only the information in the payload below.
2. Do not invent facts, claims, or promises.
3. Do not exaggerate urgency or certainty.
4. Write like a thoughtful human operator, not a generic sales bot.
5. Keep the message specific, restrained, and commercially relevant.
6. Use "review" when the lead is directionally interesting but still ambiguous enough that a human should check the angle.
7. Use "do_not_send" when the lead is out of scope, too thin, or too ambiguous to justify outreach.

Return ONLY valid JSON with this exact shape:

{
  "recommendation": "send | review | do_not_send",
  "fitReason": "string",
  "bestAngle": "string",
  "subject": "string | null",
  "body": "string | null",
  "reasoning": "string",
  "evidence": ["string"]
}

Guidance:
- recommendation:
  - "send" when the lead is well aligned and a grounded draft is justified
  - "review" when the lead is promising but still needs operator judgment
  - "do_not_send" when outreach would be poorly grounded or strategically weak
- fitReason: why this lead fits or does not fit the current wedge
- bestAngle: the most credible outreach angle if the lead is pursued
- subject: concise and specific; set to null for "do_not_send"
- body: natural, short, and relevant; set to null for "do_not_send"
- reasoning: why this angle was chosen
- evidence: short supporting statements tied to the payload

Payload:
${JSON.stringify(payload, null, 2)}
`.trim();
};
