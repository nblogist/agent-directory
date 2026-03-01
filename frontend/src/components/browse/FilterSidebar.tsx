import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchTags, fetchChains } from '../../lib/api';
import type { ListingsQuery } from '../../types/api';

interface FilterSidebarProps {
  filters: ListingsQuery;
  setFilter: (key: string, value: string | undefined) => void;
}

/** Collapsible filter section with chevron toggle */
function FilterSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-dark-border pb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-1 text-sm font-semibold text-gray-200 hover:text-white transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
            {icon}
          </span>
          {title}
        </span>
        <span
          className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

/** Radio button filter item */
function FilterRadio({
  name,
  label,
  count,
  value,
  checked,
  onChange,
  featured,
}: {
  name: string;
  label: string;
  count?: number;
  value: string;
  checked: boolean;
  onChange: (value: string | undefined) => void;
  featured?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-2 cursor-pointer group ${
        featured ? 'text-amber-400' : 'text-gray-400'
      } hover:text-white transition-colors`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(checked ? undefined : value)}
          onClick={() => {
            if (checked) onChange(undefined);
          }}
          className="accent-primary w-3.5 h-3.5 shrink-0"
        />
        <span className={`text-sm truncate ${featured ? 'font-semibold' : ''}`}>
          {featured && (
            <span className="material-symbols-outlined text-[14px] mr-0.5 align-middle text-amber-400" aria-hidden="true">
              star
            </span>
          )}
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-600 shrink-0">{count}</span>
      )}
    </label>
  );
}

/** Coming-soon placeholder filter section */
function ComingSoonSection({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="border-b border-dark-border pb-4 opacity-50">
      <div className="flex items-center justify-between py-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-400">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            {icon}
          </span>
          {title}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border text-gray-500 cursor-not-allowed"
          title="This filter is coming in a future version"
        >
          Soon
        </span>
      </div>
      <p className="text-xs text-gray-600 mt-1 cursor-not-allowed">Coming Soon</p>
    </div>
  );
}

/** Sidebar contents (shared between desktop and mobile drawer) */
function SidebarContent({ filters, setFilter }: FilterSidebarProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: chains = [] } = useQuery({
    queryKey: ['chains'],
    queryFn: fetchChains,
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Show top 10 tags by listing count
  const tags = allTags.slice(0, 10);

  return (
    <div className="space-y-4">
      {/* Navigation tabs */}
      <div className="flex flex-col gap-1 pb-4 border-b border-dark-border">
        <button
          onClick={() => setFilter('sort', undefined)}
          className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filters.sort || filters.sort === 'newest'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:text-white hover:bg-dark-surface'
          }`}
        >
          All Agents
        </button>
        <button
          onClick={() => setFilter('sort', 'views')}
          className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.sort === 'views'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:text-white hover:bg-dark-surface'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setFilter('sort', 'newest')}
          className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filters.sort === 'newest'
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:text-white hover:bg-dark-surface'
          }`}
        >
          Newest
        </button>
      </div>

      {/* Categories */}
      <FilterSection title="Categories" icon="category">
        {categories.map(cat => (
          <FilterRadio
            key={cat.id}
            name="category"
            label={cat.name}
            count={cat.listing_count}
            value={cat.slug}
            checked={filters.category === cat.slug}
            onChange={val => setFilter('category', val)}
          />
        ))}
        {categories.length === 0 && (
          <p className="text-xs text-gray-600">Loading...</p>
        )}
      </FilterSection>

      {/* Chains */}
      <FilterSection title="Chains" icon="link">
        {chains.map(chain => (
          <FilterRadio
            key={chain.id}
            name="chain"
            label={chain.name}
            value={chain.slug}
            checked={filters.chain === chain.slug}
            onChange={val => setFilter('chain', val)}
            featured={chain.is_featured}
          />
        ))}
        {chains.length === 0 && (
          <p className="text-xs text-gray-600">Loading...</p>
        )}
      </FilterSection>

      {/* Tags */}
      {tags.length > 0 && (
        <FilterSection title="Tags" icon="sell">
          {tags.map(tag => (
            <FilterRadio
              key={tag.id}
              name="tag"
              label={tag.name}
              count={tag.listing_count}
              value={tag.slug}
              checked={filters.tag === tag.slug}
              onChange={val => setFilter('tag', val)}
            />
          ))}
        </FilterSection>
      )}

      {/* Coming soon filter sections */}
      <ComingSoonSection title="Pricing" icon="payments" />
      <ComingSoonSection title="API Access" icon="api" />
      <ComingSoonSection title="LLM Model" icon="psychology" />
    </div>
  );
}

/**
 * Left sidebar with category, chain, and tag filters.
 * Desktop: sticky panel on the left (hidden below lg breakpoint).
 * Mobile: slide-in drawer triggered by the filter button in BrowsePage.
 */
export default function FilterSidebar({ filters, setFilter }: FilterSidebarProps) {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-0 pr-4">
        <SidebarContent filters={filters} setFilter={setFilter} />
      </div>
    </aside>
  );
}

/** Mobile slide-in filter drawer */
export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  setFilter,
}: FilterSidebarProps & { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-72 bg-dark-bg z-50 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter options"
      >
        {/* Close button */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-border">
          <span className="font-semibold text-white">Filters</span>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close filter drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <SidebarContent filters={filters} setFilter={setFilter} />
      </div>
    </>
  );
}
