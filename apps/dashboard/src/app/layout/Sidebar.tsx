type SidebarProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

const navItems = [
  {
    path: '/leads',
    label: 'Lead Queue',
    description: 'Review, prioritize, and open the next lead.',
  },
];

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <p className="eyebrow">SignalScout</p>
        <h2>Decision Workspace</h2>
        <p className="sidebar-copy">
          Work through the queue with a clear recommendation, supporting evidence, and the next action in one place.
        </p>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.path || currentPath.startsWith(`${item.path}/`);

          return (
            <button
              key={item.path}
              type="button"
              className={`sidebar-nav-item${isActive ? ' is-active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              <span className="sidebar-nav-label">{item.label}</span>
              <span className="sidebar-nav-copy">{item.description}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
