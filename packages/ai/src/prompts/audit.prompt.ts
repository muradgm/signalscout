import type { GenerateAuditInput } from '@signalscout/core';

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}…`;
};

export const buildAuditPrompt = (input: GenerateAuditInput): string => {
  const payload = {
    lead: {
      id: input.lead.id,
      companyName: input.lead.companyName,
      website: input.lead.website,
      niche: input.lead.niche,
      location: input.lead.location,
      country: input.lead.country ?? null,
      source: input.lead.source ?? null,
      status: input.lead.status,
      completeness: input.lead.completeness,
    },
    snapshot: {
      id: input.snapshot.id,
      url: input.snapshot.url,
      pageTitle: input.snapshot.pageTitle,
      metaDescription: input.snapshot.metaDescription,
      visibleText: truncate(input.snapshot.visibleText, 10000),
      contactInfo: input.snapshot.contactInfo,
      bookingLinks: input.snapshot.bookingLinks,
      trustSignals: input.snapshot.trustSignals,
      extractedAt: input.snapshot.extractedAt.toISOString(),
    },
    signals: input.signals,
  };

  return `
You are generating a grounded business audit for an opportunity-intelligence system.

Your job is to synthesize the provided lead data, website snapshot, and interpreted signals into a concise, commercially useful audit.

You must follow these rules strictly:

1. Only use the information provided in the JSON payload below.
2. Do not invent facts, metrics, capabilities, or weaknesses that are not supported by the payload.
3. If evidence is incomplete or indirect, reflect that uncertainty in the wording.
4. Focus on practical commercial interpretation, not generic website criticism.
5. Keep the output concise and decision-useful.
6. Avoid sounding inflated, overly polished, or more certain than the evidence supports.

Return ONLY valid JSON with this exact shape:

{
  "summary": "string",
  "strengths": ["string"],
  "opportunities": ["string"],
  "opportunityDetails": ["string"],
  "risks": ["string"],
  "recommendedAngle": "string",
  "confidenceNote": "string",
  "evidence": ["string"]
}

Guidance:
- summary: 1–2 sentences max
- strengths: concise, grounded positives
- opportunities: short UI-friendly bullets
- opportunityDetails: expanded explanation corresponding to the opportunities
- risks: concise but decision-oriented
- recommendedAngle: the best outreach or decision angle based only on the payload
- confidenceNote: one sentence explaining what limits confidence, especially if lead data is incomplete
- evidence: short, readable supporting statements grounded in the payload

Payload:
${JSON.stringify(payload, null, 2)}
`.trim();
};