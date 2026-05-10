type TopbarProps = {
  title: string;
  description: string;
  meta?: string;
};

export function Topbar({ title, description, meta }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Decision workspace</p>
        <h1>{title}</h1>
        <p className="topbar-copy">{description}</p>
      </div>
      {meta ? (
        <div className="topbar-meta">
          <span className="metric-label">Current mode</span>
          <strong>{meta}</strong>
        </div>
      ) : null}
    </header>
  );
}
