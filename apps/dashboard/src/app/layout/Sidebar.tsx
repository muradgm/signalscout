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
        <p className="eyebrow">Operator workspace</p>
        <h2>SignalScout</h2>
        <p className="sidebar-copy">
          Review the queue, hold the evidence in view, and move only the leads that earn attention.
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
