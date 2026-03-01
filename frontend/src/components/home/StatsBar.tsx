import { useQuery } from '@tanstack/react-query';
import { fetchListings, fetchCategories, fetchChains } from '../../lib/api';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="material-symbols-outlined text-primary text-3xl mb-2" aria-hidden="true">
        {icon}
      </span>
      <span className="text-3xl sm:text-4xl font-bold">{value}</span>
      <span className="text-gray-400 text-sm mt-1">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  const { data: listingsData } = useQuery({
    queryKey: ['listings-count'],
    queryFn: () => fetchListings({ per_page: 1 }),
    staleTime: 1000 * 60,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60,
  });

  const { data: chains } = useQuery({
    queryKey: ['chains'],
    queryFn: fetchChains,
    staleTime: 1000 * 60,
  });

  const agentsCount = listingsData?.meta.total ?? null;
  const categoriesCount = categories?.length ?? null;
  const chainsCount = chains?.length ?? null;

  function formatCount(n: number | null): string {
    if (n === null) return '—';
    return n.toLocaleString('en-US');
  }

  return (
    <section className="py-12 border-y border-dark-border bg-dark-surface/30">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <StatCard
          icon="smart_toy"
          value={formatCount(agentsCount)}
          label="Total Agents"
        />
        <StatCard
          icon="visibility"
          value="Coming Soon"
          label="Total Views"
        />
        <StatCard
          icon="category"
          value={formatCount(categoriesCount)}
          label="Categories"
        />
        <StatCard
          icon="link"
          value={formatCount(chainsCount)}
          label="Chains Supported"
        />
      </div>
    </section>
  );
}
