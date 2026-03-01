import type { PublicListing } from '../../types/api';
import ListingCard from './ListingCard';

interface ListingGridProps {
  listings: PublicListing[];
  isLoading: boolean;
}

/** Skeleton card for loading state */
function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl border border-dark-border p-5 animate-pulse">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-dark-surface shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-dark-surface rounded w-3/4" />
          <div className="h-3 bg-dark-surface rounded w-full" />
          <div className="h-3 bg-dark-surface rounded w-2/3" />
        </div>
      </div>
      {/* Badge row */}
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 bg-dark-surface rounded-full" />
        <div className="h-5 w-12 bg-dark-surface rounded-full" />
      </div>
      {/* Footer */}
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-24 bg-dark-surface rounded" />
        <div className="h-5 w-8 bg-dark-surface rounded" />
      </div>
    </div>
  );
}

/**
 * Responsive grid container for listing cards.
 * 1 column on mobile, 2 on sm, 3 on xl, 4 on 2xl.
 * Shows skeleton cards during loading.
 */
export default function ListingGrid({ listings, isLoading }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
