import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchListings } from '../lib/api';
import type { ListingsQuery, PaginationMeta } from '../types/api';

const DEFAULT_META: PaginationMeta = {
  page: 1,
  per_page: 20,
  total: 0,
  total_pages: 0,
};

/**
 * Syncs URL query params ↔ TanStack Query for the browse/explore page.
 * Every filter, sort, search, and page change updates the URL via setSearchParams.
 * React Router handles browser back/forward, so deep links and back button work correctly.
 */
export function useListingsQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current filters from URL
  const filters: ListingsQuery = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    chain: searchParams.get('chain') || undefined,
    sort: (searchParams.get('sort') as ListingsQuery['sort']) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    per_page: 20,
  };

  // TanStack Query with URL-derived filters as queryKey — deduplicates automatically
  const query = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
    placeholderData: keepPreviousData, // smooth transitions between filter changes
  });

  /**
   * Update a single URL param, resetting page to 1 when any filter changes.
   * Passing value=undefined removes the param from the URL.
   */
  function setFilter(key: string, value: string | undefined) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value !== undefined && value !== null) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      // Reset to page 1 whenever a filter changes (not when paginating)
      if (key !== 'page') next.delete('page');
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Remove all filter params, returning to default browse state */
  function clearFilters() {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return {
    listings: query.data?.data ?? [],
    meta: query.data?.meta ?? DEFAULT_META,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    filters,
    setFilter,
    clearFilters,
  };
}
