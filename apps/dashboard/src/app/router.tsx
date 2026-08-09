import { useEffect, useState } from 'react';
import { DashboardLayout } from './layout/DashboardLayout';
import { LeadDetailPage } from '../pages/LeadDetailPage';
import { LeadsPage } from '../pages/LeadsPage';
import { MarketingHomePage } from '../pages/MarketingHomePage';

type Route =
  | { kind: 'marketing'; path: '/' }
  | { kind: 'leads'; path: '/leads' }
  | { kind: 'lead-detail'; path: string; leadId: string }
  | { kind: 'not-found'; path: string };

const parseRoute = (pathname: string): Route => {
  if (pathname === '/' || pathname === '') {
    return { kind: 'marketing', path: '/' };
  }

  const detailMatch = pathname.match(/^\/leads\/([^/]+)$/);

  if (detailMatch) {
    return {
      kind: 'lead-detail',
      path: pathname,
      leadId: decodeURIComponent(detailMatch[1]),
    };
  }

  if (pathname === '/leads') {
    return { kind: 'leads', path: '/leads' };
  }

  return { kind: 'not-found', path: pathname };
};

export function AppRouter() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const handlePopState = (): void => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string): void => {
    const nextPath = path || '/leads';

    if (nextPath === window.location.pathname) {
      return;
    }

    window.history.pushState({}, '', nextPath);
    setRoute(parseRoute(nextPath));
  };

  if (route.kind === 'marketing') {
    return <MarketingHomePage onNavigate={navigate} />;
  }

  const layoutTitle =
    route.kind === 'lead-detail'
      ? 'Lead review'
      : route.kind === 'not-found'
        ? 'Page not found'
        : 'Lead queue';
  const layoutDescription =
    route.kind === 'lead-detail'
      ? 'Confirm the recommendation, verify the evidence, and act without leaving the workflow.'
      : route.kind === 'not-found'
        ? 'This workspace route does not exist.'
        : 'Work through leads that need attention, verify the evidence, and resolve the next operator decision.';
  const layoutMeta =
    route.kind === 'lead-detail'
      ? 'Decision in progress'
      : route.kind === 'not-found'
        ? '404'
        : 'Operator workspace';

  return (
    <DashboardLayout
      currentPath={route.path}
      onNavigate={navigate}
      title={layoutTitle}
      description={layoutDescription}
      meta={layoutMeta}
    >
      {route.kind === 'lead-detail' ? (
        <LeadDetailPage leadId={route.leadId} onNavigate={navigate} />
      ) : route.kind === 'leads' ? (
        <LeadsPage onNavigate={navigate} />
      ) : (
        <div className="empty-card" role="status">
          <h3>Page not found</h3>
          <p>The route <code>{route.path}</code> is not part of this workspace.</p>
          <button type="button" className="button" onClick={() => navigate('/leads')}>
            Return to lead queue
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
