export type LeadQueueScope =
  | 'all'
  | 'priority_review'
  | 'non_berlin'
  | 'weak_contact'
  | 'niche_valid';

type LeadFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  scope: LeadQueueScope;
  onScopeChange: (value: LeadQueueScope) => void;
  counts: Record<LeadQueueScope, number>;
};

export function LeadFilters({
  searchTerm,
  onSearchTermChange,
  scope,
  onScopeChange,
  counts,
}: LeadFiltersProps) {
  const scopeOptions: Array<{ value: LeadQueueScope; label: string }> = [
    { value: 'all', label: 'All visible' },
    { value: 'priority_review', label: 'Priority review' },
    { value: 'non_berlin', label: 'Non-Berlin' },
    { value: 'weak_contact', label: 'Weak-contact' },
    { value: 'niche_valid', label: 'Niche-valid' },
  ];

  return (
    <div className="lead-filters">
      <label className="search-field">
        <span>Find a lead</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Company, site, location"
        />
      </label>

      <div className="scope-filter-group" role="group" aria-label="Queue focus">
        {scopeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`scope-filter-chip${scope === option.value ? ' is-active' : ''}`}
            onClick={() => onScopeChange(option.value)}
          >
            <span>{option.label}</span>
            <strong>{counts[option.value] ?? 0}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
