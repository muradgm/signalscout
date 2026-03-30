import type { OutreachMessage } from '@signalscout/core';

export const mapOutreachToResponse = (outreach: OutreachMessage) => {
  return {
    id: outreach.id,
    leadId: outreach.leadId,
    auditId: outreach.auditId,
    channel: outreach.channel,
    recommendation: outreach.recommendation,
    status: outreach.status,
    fitReason: outreach.fitReason,
    bestAngle: outreach.bestAngle,
    subject: outreach.subject,
    body: outreach.body,
    reasoning: outreach.reasoning,
    evidence: outreach.evidence,
    createdAt: outreach.createdAt.toISOString(),
  };
};