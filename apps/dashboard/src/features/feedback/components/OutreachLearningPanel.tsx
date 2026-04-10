import type { OutreachLearningSummary } from '../types';

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const renderTopList = (items: { label: string; count: number }[]) =>
  items.length > 0
    ? items.map((item) => `${item.label} (${item.count})`).join(', ')
    : 'No reviewed history yet.';

const getRecommendedFocus = (summary: OutreachLearningSummary): string => {
  if (summary.totalReviewed === 0) {
    return 'No reviewed history yet.';
  }

  if (summary.editedRate >= 0.4) {
    return 'Operators are editing a large share of drafts. Tighten the default copy before scaling send volume.';
  }

  if (summary.skippedRate >= 0.25) {
    return 'Skips are elevated. Recheck fit thresholds and whether weaker leads are reaching the review lane too often.';
  }

  if (
    summary.bodyEditedRate > summary.subjectEditedRate &&
    summary.bodyEditedRate >= 0.3
  ) {
    return 'Body edits are more common than subject edits. The opening and ask likely need the next round of copy tuning.';
  }

  return 'Review behavior looks stable. Keep watching niche and multilingual segments for drift rather than rewriting the default path broadly.';
};

export function OutreachLearningPanel({
  summary,
}: {
  summary: OutreachLearningSummary;
}) {
  if (summary.totalReviewed === 0) {
    return null;
  }

  const recommendedFocus = getRecommendedFocus(summary);

  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Learning loop</p>
          <h3>Accepted vs edited patterns</h3>
          <p className="panel-copy">
            This turns recent reviewed outreach into a usable tuning signal
            instead of leaving it as raw metadata.
          </p>
        </div>
      </div>

      <div className="timeline-list">
        <div className="timeline-item">
          <div>
            <span className="metric-label">Current reading</span>
            <strong>{summary.totalReviewed} reviewed drafts</strong>
          </div>
          <p>{recommendedFocus}</p>
        </div>
      </div>

      <div className="queue-report__grid">
        <article className="queue-report__card">
          <span className="metric-label">Accepted</span>
          <strong>{asPercent(summary.acceptedRate)}</strong>
          <p className="panel-copy">Recent reviewed drafts accepted without edits.</p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Edited</span>
          <strong>{asPercent(summary.editedRate)}</strong>
          <p className="panel-copy">Recent reviewed drafts changed by the operator.</p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Multilingual</span>
          <strong>{asPercent(summary.multilingualShare)}</strong>
          <p className="panel-copy">
            Share of reviewed outreach showing multilingual cues.
          </p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Specialty</span>
          <strong>{asPercent(summary.specialtyShare)}</strong>
          <p className="panel-copy">
            Share of reviewed outreach tied to specialty-valid leads.
          </p>
        </article>
      </div>

      <div className="timeline-list">
        <div className="timeline-item">
          <div>
            <span className="metric-label">Top angles</span>
            <strong>{summary.totalReviewed} reviewed</strong>
          </div>
          <p>{renderTopList(summary.topAngles)}</p>
        </div>
        <div className="timeline-item">
          <div>
            <span className="metric-label">Edited angles</span>
            <strong>{asPercent(summary.bodyEditedRate)} body edits</strong>
          </div>
          <p>{renderTopList(summary.topEditedAngles)}</p>
        </div>
        <div className="timeline-item">
          <div>
            <span className="metric-label">Edited niches</span>
            <strong>{asPercent(summary.subjectEditedRate)} subject edits</strong>
          </div>
          <p>{renderTopList(summary.topEditedNiches)}</p>
        </div>
      </div>

      <div className="timeline-list">
        <div className="timeline-item">
          <div>
            <span className="metric-label">Non-Berlin reviewed</span>
            <strong>{summary.reviewSegments.nonBerlin.total} leads</strong>
          </div>
          <p>
            Accepted {asPercent(summary.reviewSegments.nonBerlin.acceptedRate)} |
            {' '}Edited {asPercent(summary.reviewSegments.nonBerlin.editedRate)} |
            {' '}Skipped {asPercent(summary.reviewSegments.nonBerlin.skippedRate)}
          </p>
        </div>
        <div className="timeline-item">
          <div>
            <span className="metric-label">Weak-surface reviewed</span>
            <strong>{summary.reviewSegments.weakSurface.total} leads</strong>
          </div>
          <p>
            Accepted {asPercent(summary.reviewSegments.weakSurface.acceptedRate)} |
            {' '}Edited {asPercent(summary.reviewSegments.weakSurface.editedRate)} |
            {' '}Skipped {asPercent(summary.reviewSegments.weakSurface.skippedRate)}
          </p>
        </div>
        <div className="timeline-item">
          <div>
            <span className="metric-label">Specialty reviewed</span>
            <strong>{summary.reviewSegments.specialty.total} leads</strong>
          </div>
          <p>
            Accepted {asPercent(summary.reviewSegments.specialty.acceptedRate)} |
            {' '}Edited {asPercent(summary.reviewSegments.specialty.editedRate)} |
            {' '}Skipped {asPercent(summary.reviewSegments.specialty.skippedRate)}
          </p>
        </div>
        <div className="timeline-item">
          <div>
            <span className="metric-label">Multilingual reviewed</span>
            <strong>{summary.reviewSegments.multilingual.total} leads</strong>
          </div>
          <p>
            Accepted {asPercent(summary.reviewSegments.multilingual.acceptedRate)} |
            {' '}Edited {asPercent(summary.reviewSegments.multilingual.editedRate)} |
            {' '}Skipped {asPercent(summary.reviewSegments.multilingual.skippedRate)}
          </p>
        </div>
      </div>
    </section>
  );
}
