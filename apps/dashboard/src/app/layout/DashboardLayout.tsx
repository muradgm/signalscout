import type { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

type DashboardLayoutProps = PropsWithChildren<{
  currentPath: string;
  onNavigate: (path: string) => void;
  title: string;
  description: string;
  meta?: string;
}>;

export function DashboardLayout({
  currentPath,
  onNavigate,
  title,
  description,
  meta,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="dashboard-main">
        <Topbar title={title} description={description} meta={meta} />
        {children}
      </main>
    </div>
  );
}
