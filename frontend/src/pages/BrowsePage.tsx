import { useState } from 'react';
import { useListingsQuery } from '../hooks/useListingsQuery';
import FilterSidebar, { MobileFilterDrawer } from '../components/browse/FilterSidebar';
import ListingGrid from '../components/browse/ListingGrid';
import SortDropdown from '../components/browse/SortDropdown';
import Pagination from '../components/browse/Pagination';
import EmptyState from '../components/browse/EmptyState';

/**
 * Browse/Explore page — core agent discovery interface.
 *
 * All state is derived from URL query params via useListingsQuery:
 * - ?search=  full-text search
 * - ?category= filter by category slug
 * - ?chain=   filter by chain slug
 * - ?tag=     filter by tag slug
 * - ?sort=    newest | views | alpha
 * - ?page=    1-indexed page number
 *
 * URL reflects all filter state, so deep links and browser back/forward work correctly.
 */
export default function BrowsePage() {
  const { listings, meta, isLoading, filters, setFilter, clearFilters } = useListingsQuery();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasResults = listings.length > 0 || isLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar: count + mobile filter toggle + sort */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle button (visible below lg) */}
          <button
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dark-border text-sm text-gray-300 hover:text-white hover:border-primary/50 transition-colors"
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Open filters"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              tune
            </span>
            Filters
          </button>

          <h1 className="text-base sm:text-xl font-bold text-white">
            {isLoading ? (
              <span className="text-gray-400">Loading agents...</span>
            ) : (
              <>
                Showing{' '}
                <span className="text-primary">{meta.total}</span>{' '}
                agent{meta.total !== 1 ? 's' : ''}
              </>
            )}
          </h1>
        </div>

        <SortDropdown
          sort={filters.sort}
          onChange={v => setFilter('sort', v)}
        />
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <FilterSidebar filters={filters} setFilter={setFilter} />

        {/* Mobile filter drawer */}
        <MobileFilterDrawer
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          filters={filters}
          setFilter={setFilter}
        />

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Active filter pills */}
          {(filters.search || filters.category || filters.chain || filters.tag) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.search && (
                <FilterPill
                  label={`Search: "${filters.search}"`}
                  onRemove={() => setFilter('search', undefined)}
                />
              )}
              {filters.category && (
                <FilterPill
                  label={`Category: ${filters.category}`}
                  onRemove={() => setFilter('category', undefined)}
                />
              )}
              {filters.chain && (
                <FilterPill
                  label={`Chain: ${filters.chain}`}
                  onRemove={() => setFilter('chain', undefined)}
                />
              )}
              {filters.tag && (
                <FilterPill
                  label={`Tag: ${filters.tag}`}
                  onRemove={() => setFilter('tag', undefined)}
                />
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-white underline underline-offset-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results or empty state */}
          {!hasResults ? (
            <EmptyState searchTerm={filters.search} onClearFilters={clearFilters} />
          ) : (
            <>
              <ListingGrid listings={listings} isLoading={isLoading} />
              <Pagination
                meta={meta}
                onPageChange={p => setFilter('page', String(p))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small removable pill for active filters */
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
          close
        </span>
      </button>
    </span>
  );
}
