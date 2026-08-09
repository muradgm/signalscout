import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppRouter } from './router';

vi.mock('./layout/DashboardLayout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

vi.mock('../pages/LeadsPage', () => ({
  LeadsPage: () => <div>Lead queue page</div>,
}));

vi.mock('../pages/LeadDetailPage', () => ({
  LeadDetailPage: ({ leadId }: { leadId: string }) => <div>Lead detail {leadId}</div>,
}));

vi.mock('../pages/MarketingHomePage', () => ({
  MarketingHomePage: ({ onNavigate }: { onNavigate: (path: string) => void }) => (
    <div>
      <h1>Marketing home</h1>
      <button type="button" onClick={() => onNavigate('/leads')}>
        Open workspace
      </button>
    </div>
  ),
}));

describe('AppRouter', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('renders the marketing homepage at the root path', () => {
    window.history.replaceState({}, '', '/');

    render(<AppRouter />);

    expect(screen.getByRole('heading', { name: 'Marketing home' })).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-layout')).not.toBeInTheDocument();
  });

  it('navigates from the marketing homepage into the lead workspace', () => {
    window.history.replaceState({}, '', '/');

    render(<AppRouter />);

    fireEvent.click(screen.getByRole('button', { name: 'Open workspace' }));

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByText('Lead queue page')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/leads');
  });

  it('renders lead detail routes inside the dashboard layout', () => {
    window.history.replaceState({}, '', '/leads/lead-123');

    render(<AppRouter />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByText('Lead detail lead-123')).toBeInTheDocument();
  });

  it('renders an explicit not-found state for unknown routes', () => {
    window.history.replaceState({}, '', '/unknown-workspace-route');

    render(<AppRouter />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Marketing home' })).not.toBeInTheDocument();
  });
});
