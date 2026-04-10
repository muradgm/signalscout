type OutreachComposerProps = {
  subject: string;
  body: string;
  isDisabled?: boolean;
  isStale?: boolean;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onAccept: () => void;
  onSaveEdits: () => void;
  onSkip: () => void;
  onSend: () => void;
  isDirty?: boolean;
  canSend?: boolean;
  sendHelpText?: string | null;
  isWorking?: boolean;
  isSending?: boolean;
  hasSendFailure?: boolean;
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
  onAccept,
  onSaveEdits,
  onSkip,
  onSend,
  isDirty = false,
  canSend = false,
  sendHelpText = null,
  isWorking = false,
  isSending = false,
  hasSendFailure = false,
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
          disabled={isDisabled || isWorking}
          placeholder="No subject generated yet"
        />
      </label>

      <label className="form-field">
        <span>Body</span>
        <textarea
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          disabled={isDisabled || isWorking}
          rows={12}
          placeholder="No body generated yet"
        />
      </label>

      {sendHelpText ? <p className="status-note">{sendHelpText}</p> : null}

      <div className="action-row">
        <button type="button" onClick={onRegenerate} disabled={isWorking}>
          Regenerate
        </button>
        <button type="button" className="button-secondary" onClick={onCopy} disabled={isWorking}>
          Copy
        </button>
        <button type="button" className="button-secondary" onClick={onAccept} disabled={isWorking}>
          Accept draft
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={onSaveEdits}
          disabled={isDisabled || isWorking || !isDirty}
        >
          Save edits
        </button>
        <button type="button" className="button-secondary" onClick={onSkip} disabled={isWorking}>
          Skip
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={isDisabled || isWorking || !canSend}
        >
          {isSending ? 'Sending...' : hasSendFailure ? 'Retry send' : 'Send now'}
        </button>
      </div>
    </section>
  );
}
