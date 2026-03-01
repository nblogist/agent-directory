import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchListing, ApiError } from '../lib/api';
import DetailHero from '../components/detail/DetailHero';
import DetailDescription from '../components/detail/DetailDescription';
import DetailSidebar from '../components/detail/DetailSidebar';
import NotFoundPage from './NotFoundPage';

/** Skeleton loading state matching the hero + description + sidebar layout */
function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-10 bg-dark-surface rounded" />
        <div className="h-4 w-4 bg-dark-surface rounded" />
        <div className="h-4 w-14 bg-dark-surface rounded" />
        <div className="h-4 w-4 bg-dark-surface rounded" />
        <div className="h-4 w-32 bg-dark-surface rounded" />
      </div>

      {/* Hero skeleton */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-dark-surface shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-9 w-2/3 bg-dark-surface rounded" />
          <div className="h-5 w-full bg-dark-surface rounded" />
          <div className="flex gap-2 mt-4">
            <div className="h-7 w-24 bg-dark-surface rounded-full" />
            <div className="h-7 w-16 bg-dark-surface rounded-full" />
            <div className="h-7 w-20 bg-dark-surface rounded-full" />
          </div>
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="mt-6 flex gap-3">
        <div className="h-10 w-28 bg-dark-surface rounded-lg" />
        <div className="h-10 w-24 bg-dark-surface rounded-lg" />
      </div>

      {/* Body skeleton */}
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Tab bar */}
          <div className="border-b border-dark-border pb-3 flex gap-4">
            <div className="h-5 w-20 bg-dark-surface rounded" />
            <div className="h-5 w-24 bg-dark-surface rounded opacity-50" />
          </div>
          {/* Card */}
          <div className="glass-card rounded-xl border border-dark-border p-6 space-y-3">
            <div className="h-4 w-full bg-dark-surface rounded" />
            <div className="h-4 w-5/6 bg-dark-surface rounded" />
            <div className="h-4 w-4/6 bg-dark-surface rounded" />
            <div className="h-4 w-full bg-dark-surface rounded" />
            <div className="h-4 w-3/4 bg-dark-surface rounded" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="glass-card rounded-xl border border-dark-border p-5 space-y-3">
            <div className="h-4 w-20 bg-dark-surface rounded" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-full bg-dark-surface rounded" />
            ))}
          </div>
          <div className="glass-card rounded-xl border border-dark-border p-5 space-y-3">
            <div className="h-4 w-24 bg-dark-surface rounded" />
            <div className="h-9 w-full bg-dark-surface rounded-lg" />
            <div className="h-9 w-full bg-dark-surface rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Error display with retry option */
function ErrorDisplay({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <span className="material-symbols-outlined text-5xl text-gray-600 mb-4 block">
        error_outline
      </span>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-primary hover:scale-[1.05] active:scale-95 transition-all px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base leading-none">refresh</span>
        Try Again
      </button>
      <div className="mt-4">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

/**
 * Full listing detail page.
 * Fetches agent data by slug, auto-increments view count via GET /api/listings/:slug,
 * and renders hero, description with markdown, and metadata sidebar.
 */
export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: listing,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => fetchListing(slug!),
    enabled: !!slug,
    retry: (failureCount, err) => {
      // Don't retry on 404
      if (err instanceof ApiError && err.status === 404) return false;
      return failureCount < 2;
    },
  });

  // Loading state
  if (isLoading) return <DetailSkeleton />;

  // 404 state — if API returns 404, show styled 404 page inline
  if (error instanceof ApiError && error.status === 404) {
    return <NotFoundPage />;
  }

  // Other error state
  if (error || !listing) {
    return <ErrorDisplay error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DetailHero listing={listing} />

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main content: description + coming-soon sections */}
        <div className="flex-1 min-w-0">
          <DetailDescription listing={listing} />
        </div>

        {/* Sidebar: metadata, chain support, submit CTA */}
        <DetailSidebar listing={listing} />
      </div>
    </div>
  );
}
