import type { ListingsQuery } from '../../types/api';

interface SortDropdownProps {
  sort: ListingsQuery['sort'];
  onChange: (value: ListingsQuery['sort']) => void;
}

const SORT_OPTIONS: { value: NonNullable<ListingsQuery['sort']>; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'alpha', label: 'A-Z' },
];

export default function SortDropdown({ sort, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400 hidden sm:inline">Sort:</span>
      <select
        value={sort ?? 'newest'}
        onChange={e => onChange(e.target.value as NonNullable<ListingsQuery['sort']>)}
        className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
        aria-label="Sort listings"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
