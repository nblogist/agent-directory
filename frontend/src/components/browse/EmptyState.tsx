import { Link } from 'react-router-dom';

interface EmptyStateProps {
  searchTerm?: string;
  onClearFilters: () => void;
}

const POPULAR_SEARCHES = [
  'DeFi Agents',
  'Trading Bots',
  'Data Analytics',
  'Smart Contract',
  'NFT Tools',
  'Bridge Protocols',
];

/**
 * No-results state for the browse page.
 * Shows context-aware message, clear filters CTA, and popular search suggestions.
 */
export default function EmptyState({ searchTerm, onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      {/* Icon */}
      <span
        className="material-symbols-outlined text-6xl text-gray-600 mb-4 block"
        aria-hidden="true"
      >
        search_off
      </span>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-2 text-white">No agents found</h2>

      {/* Message */}
      <p className="text-gray-400 mb-6">
        {searchTerm
          ? (
            <>
              No results for{' '}
              <span className="text-white font-medium">"{searchTerm}"</span>
            </>
          )
          : 'No agents match the current filters.'}
      </p>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onClearFilters}
          className="bg-primary hover:scale-[1.05] active:scale-95 transition-all px-6 py-2.5 rounded-lg font-semibold text-white hover:shadow-[0_0_20px_rgba(55,19,236,0.4)]"
        >
          Clear All Filters
        </button>

        <span
          className="border border-dark-border hover:border-primary/50 px-6 py-2.5 rounded-lg text-gray-400 transition-colors cursor-not-allowed select-none"
          title="Agent submission coming soon"
        >
          Request Agent
        </span>
      </div>

      {/* Popular searches grid */}
      <div className="mt-12">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
          Popular Searches
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto">
          {POPULAR_SEARCHES.map(term => (
            <Link
              key={term}
              to={`/browse?search=${encodeURIComponent(term)}`}
              className="px-4 py-2.5 rounded-lg border border-dark-border text-sm text-gray-400 hover:text-white hover:border-primary/50 transition-colors text-center"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
