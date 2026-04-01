type LeadFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
};

export function LeadFilters({
  searchTerm,
  onSearchTermChange,
}: LeadFiltersProps) {
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
    </div>
  );
}
