import { Link } from 'react-router-dom';

interface EmptyStateProps {
  searchTerm?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({ searchTerm = '', onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 rounded-3xl border-2 border-dashed border-dark-border bg-dark-surface/10">
      {/* Abstract Visual Illustration */}
      <div className="relative mb-8">
        <div className="w-64 h-64 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 w-48 h-48 bg-dark-surface rounded-3xl border border-dark-border flex flex-col items-center justify-center gap-4 shadow-2xl rotate-3">
            <div className="flex gap-2">
              <div className="w-8 h-2 bg-dark-surface2 rounded-full"></div>
              <div className="w-12 h-2 bg-dark-surface2 rounded-full"></div>
            </div>
            <div className="w-32 h-2 bg-dark-surface2/50 rounded-full"></div>
            <div className="w-24 h-2 bg-dark-surface2/50 rounded-full"></div>
            <div className="mt-4 flex items-center justify-center size-16 rounded-full bg-dark-surface/50 text-theme-text-muted">
              <span className="material-symbols-outlined text-4xl">search_off</span>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl backdrop-blur-md border border-primary/20 -rotate-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
          </div>
          <div className="absolute -bottom-2 -left-8 w-20 h-20 bg-dark-surface2/50 rounded-2xl backdrop-blur-md border border-dark-border rotate-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-theme-text-muted text-2xl">question_mark</span>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl lg:text-3xl font-bold">No listings found</h2>
        <p className="text-theme-text-secondary text-base lg:text-lg leading-relaxed">
          We couldn't find any listings matching your current search
          {searchTerm && (
            <>
              {' '}
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm italic">"{searchTerm}"</span>
            </>
          )}
          {' '}or filter criteria.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={onClearFilters}
            className="flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-white font-bold transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <span className="material-symbols-outlined text-lg">filter_alt_off</span>
            <span>Clear All Filters</span>
          </button>
          <Link
            to="/submit"
            className="flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-xl h-12 px-6 bg-dark-surface2 text-theme-text font-bold transition-all hover:bg-dark-border"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Submit a Listing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
