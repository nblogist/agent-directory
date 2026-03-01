import type { PaginationMeta } from '../../types/api';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

/**
 * Generate page number list with ellipsis for large page counts.
 * e.g. [1, 2, 3, '...', 8, 9, 10]
 */
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];

  // Always show first 3
  if (current <= 4) {
    for (let i = 1; i <= Math.min(5, total); i++) pages.push(i);
    pages.push('...');
    pages.push(total - 1);
    pages.push(total);
  }
  // Always show last 3
  else if (current >= total - 3) {
    pages.push(1);
    pages.push(2);
    pages.push('...');
    for (let i = Math.max(total - 4, 3); i <= total; i++) pages.push(i);
  }
  // Middle: show current -1, current, current +1
  else {
    pages.push(1);
    pages.push('...');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  }

  return pages;
}

/** Numbered pagination with prev/next arrows */
export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, total_pages } = meta;

  if (total_pages <= 1) return null;

  const pageNumbers = getPageNumbers(page, total_pages);

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-8"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dark-border text-sm text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
          chevron_left
        </span>
      </button>

      {/* Page numbers */}
      {pageNumbers.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-600 text-sm select-none">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-primary text-white'
                : 'bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-primary/50'
            }`}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === total_pages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dark-border text-sm text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
          chevron_right
        </span>
      </button>
    </nav>
  );
}
