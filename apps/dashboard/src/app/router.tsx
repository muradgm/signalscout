import { useEffect, useState } from 'react';
import { DashboardLayout } from './layout/DashboardLayout';
import { LeadDetailPage } from '../pages/LeadDetailPage';
import { LeadsPage } from '../pages/LeadsPage';
import { MarketingHomePage } from '../pages/MarketingHomePage';

type Route =
  | { kind: 'marketing'; path: '/' }
  | { kind: 'leads'; path: '/leads' }
  | { kind: 'lead-detail'; path: string; leadId: string };

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

  return { kind: 'marketing', path: '/' };
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
    route.kind === 'lead-detail' ? 'Lead review' : 'Lead queue';
  const layoutDescription =
    route.kind === 'lead-detail'
      ? 'Confirm the recommendation, verify the evidence, and act without leaving the workflow.'
      : 'Work through the queue, spot the strongest opportunities quickly, and open the next lead worth action.';
  const layoutMeta =
    route.kind === 'lead-detail' ? 'Decision in progress' : 'Operator workspace';

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
      ) : (
        <LeadsPage onNavigate={navigate} />
      )}
    </DashboardLayout>
  );
}
