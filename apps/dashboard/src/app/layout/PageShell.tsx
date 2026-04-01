import type { PropsWithChildren, ReactNode } from 'react';

type PageShellProps = PropsWithChildren<{
  title: string;
  description: string;
  meta?: string;
  actions?: ReactNode;
}>;

export function PageShell({
  title,
  description,
  meta,
  actions,
  children,
}: PageShellProps) {
  return (
    <section className="page-shell">
      <div className="page-shell__header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>{title}</h2>
          <p className="page-shell__copy">{description}</p>
        </div>
        <div className="page-shell__meta">
          {meta ? (
            <div className="page-shell__meta-block">
              <span className="metric-label">Status</span>
              <strong>{meta}</strong>
            </div>
          ) : null}
          {actions}
        </div>
      </div>
      {children}
    </section>
  );
}
