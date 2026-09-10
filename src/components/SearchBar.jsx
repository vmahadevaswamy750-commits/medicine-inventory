export default function SearchBar({ value, onChange, isSearching }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10.8" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Search by medicine name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search medicines by name"
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
      {isSearching && <span className="search-status">Searching…</span>}
    </div>
  );
}
