import type {
  AuditGenerator,
  GenerateAuditInput,
  GeneratedAuditDraft,
} from '@signalscout/core';

export class MockAuditGenerator implements AuditGenerator {
  async generate(input: GenerateAuditInput): Promise<GeneratedAuditDraft> {
    const { lead, snapshot, signals } = input;

    // Early exit for placeholder/weak content
    if (snapshot.isPlaceholderContent || snapshot.visibleText.length < 400) {
      return {
        summary: `${lead.companyName} currently shows very limited real business content. A meaningful audit requires a live, content-rich website.`,
        strengths: [],
        opportunities: ['Replace placeholder or minimal content with real clinic information'],
        opportunityDetails: ['Without sufficient content we cannot reliably evaluate conversion flow, trust signals, or local relevance.'],
        risks: ['Any outreach at this stage would be poorly grounded and likely ineffective'],
        recommendedAngle: 'Pause outreach until the website contains real, patient-focused content.',
        confidenceNote: 'Very low confidence — insufficient website content for proper analysis.',
        evidence: ['Visible text too short for meaningful analysis', 'Page appears placeholder-like or under construction'],
        quickWins: [],
        outreachHook: '',
      };
    }

    // Extract key details from actual content
    const hasFamilyMention = snapshot.visibleText.toLowerCase().includes('vater und sohn') || 
                            snapshot.visibleText.toLowerCase().includes('peter und marco');
    const hasLongHistory = snapshot.visibleText.toLowerCase().includes('50 jahr') || 
                          snapshot.visibleText.toLowerCase().includes('seit über 50');
    const hasFearPatients = snapshot.visibleText.toLowerCase().includes('angstpatienten');
    const hasAquarium = snapshot.visibleText.toLowerCase().includes('korallenriffaquarium') || 
                       snapshot.visibleText.toLowerCase().includes('aquarium');

    const hasDirectBooking = snapshot.bookingLinks.length > 0;
    const hasStrongContact = snapshot.contactInfo.emails.length > 0 || snapshot.contactInfo.phones.length > 0;
    const hasTrustCues = snapshot.trustSignals.length > 0;

    // ─────────────────────────────────────────────
    // Sharp, consequence-driven Summary
    let summary = `${lead.companyName} has a credible local presence with a direct booking path and clear contact options.`;

    if (hasLongHistory && hasFamilyMention) {
      summary += ` The family-run, 50+ year history is a strong trust asset that is currently underutilized in the conversion experience.`;
    } else if (hasFearPatients) {
      summary += ` Specializing in anxious patients is a meaningful differentiator that deserves stronger visual and messaging support.`;
    }

    if (!hasDirectBooking) {
      summary += ` However, the path from interest to booking still contains unnecessary friction.`;
    }

    // ─────────────────────────────────────────────
    // Strengths (specific to this site)
    const strengths: string[] = [
      "Direct booking link is available",
      "Multiple contact methods (phone + email) are clearly visible",
    ];

    if (hasLongHistory) strengths.push("Long-standing local reputation (50+ years) is mentioned");
    if (hasFamilyMention) strengths.push("Family-run practice adds personal trust");
    if (hasFearPatients) strengths.push("Focus on anxious patients is clearly communicated");
    if (hasAquarium) strengths.push("Unique waiting room experience (coral aquarium) creates positive first impression");

    // ─────────────────────────────────────────────
    // Opportunities + Business Impact
    const opportunities: string[] = [];
    const opportunityDetails: string[] = [];

    if (signals.localRelevance !== 'high_match') {
      opportunities.push("Local relevance can be strengthened");
      opportunityDetails.push("The site mentions Berlin / Prenzlauer Berg but could reinforce location more aggressively to capture 'near me' searches.");
    }

    if (!hasDirectBooking || snapshot.bookingLinks.length === 0) {
      opportunities.push("Booking flow could be more prominent");
      opportunityDetails.push("Even though a booking section exists, making the CTA larger and always visible (especially on mobile) would reduce drop-off for ready-to-book visitors.");
    }

    if (!hasTrustCues || snapshot.trustSignals.length < 2) {
      opportunities.push("Trust signals could be more prominent");
      opportunityDetails.push("Adding recent Google reviews, before/after photos, or patient testimonials near the CTA would convert hesitant visitors faster.");
    }

    // ─────────────────────────────────────────────
    // Risks
    const risks: string[] = [];
    if (lead.completeness !== 'complete') {
      risks.push("Incomplete lead metadata reduces targeting precision.");
    }
    if (signals.outreachFit === 'uncertain') {
      risks.push("Mixed signals suggest this lead may need human review before full automation.");
    }

    const recommendedAngle = "Leverage the long family tradition and patient-friendly approach while making the path to booking frictionless.";

    // ─────────────────────────────────────────────
    // Quick Wins (actionable & high-ROI)
    const quickWins = [
      "Make the 'Termin online buchen' button larger and sticky on mobile",
      "Add 3–4 recent Google reviews with photos near the main CTA",
      "Highlight the 50+ year family tradition more prominently on the homepage",
      "Add a prominent phone/WhatsApp floating button for fear patients",
    ];

    // ─────────────────────────────────────────────
    // Outreach Hook (personalized & helpful)
    const outreachHook = `Hi,\n\nI came across Zahnarzt Michael in Prenzlauer Berg and was impressed by the 50+ year family tradition and your focus on anxious patients.\n\nOne area that stood out is that while booking is possible, the path could be even smoother for visitors who are ready to take action.\n\nI'd be happy to share a few quick, high-impact suggestions that similar practices have used to increase inquiries. No obligation — just happy to help if useful.\n\nBest,\n[Your Name]`;

    return {
      summary,
      strengths: [...new Set(strengths)].slice(0, 5),
      opportunities: [...new Set(opportunities)].slice(0, 4),
      opportunityDetails: [...new Set(opportunityDetails)].slice(0, 4),
      risks: [...new Set(risks)].slice(0, 4),
      recommendedAngle,
      confidenceNote: `Confidence: ${signals.confidence}. Analysis based on actual site content including family history, patient focus, and booking signals.`,
      evidence: [
        `Direct booking link found: ${snapshot.bookingLinks[0] || 'none'}`,
        `Contact clarity: ${signals.contactClarity}`,
        `Trust signals detected: ${snapshot.trustSignals.join(', ')}`,
        `Local relevance: ${signals.localRelevance}`,
        hasLongHistory ? "50+ year family tradition mentioned" : "",
      ].filter(Boolean),
      quickWins,
      outreachHook,
    };
  }
}