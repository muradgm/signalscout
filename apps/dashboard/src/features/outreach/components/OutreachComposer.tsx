type OutreachComposerProps = {
  subject: string;
  body: string;
  isDisabled?: boolean;
  isStale?: boolean;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onSkip: () => void;
  onSendLater: () => void;
};

export function OutreachComposer({
  subject,
  body,
  isDisabled = false,
  isStale = false,
  onSubjectChange,
  onBodyChange,
  onRegenerate,
  onCopy,
  onSkip,
  onSendLater,
}: OutreachComposerProps) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Action</p>
          <h3>Outreach editor</h3>
        </div>
      </div>

      {isStale ? (
        <p className="status-note">
          The upstream data changed. Regenerate this draft before acting on it.
        </p>
      ) : null}

      <label className="form-field">
        <span>Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          disabled={isDisabled}
          placeholder="No subject generated yet"
        />
      </label>

      <label className="form-field">
        <span>Body</span>
        <textarea
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          disabled={isDisabled}
          rows={12}
          placeholder="No body generated yet"
        />
      </label>

      <div className="action-row">
        <button type="button" onClick={onRegenerate}>
          Regenerate
        </button>
        <button type="button" className="button-secondary" onClick={onCopy}>
          Copy
        </button>
        <button type="button" className="button-secondary" onClick={onSkip}>
          Skip
        </button>
        <button type="button" className="button-secondary" onClick={onSendLater}>
          Send later
        </button>
      </div>
    </section>
  );
}
