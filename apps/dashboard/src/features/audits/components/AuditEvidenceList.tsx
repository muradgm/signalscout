type AuditEvidenceListProps = {
  evidence: string[];
};

export function AuditEvidenceList({ evidence }: AuditEvidenceListProps) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Evidence</p>
          <h3>Why the system landed here</h3>
        </div>
      </div>

      <ul className="bullet-list">
        {evidence.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
