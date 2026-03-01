import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../lib/api';

export default function TrendingPills() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-dark-surface rounded-full h-8 w-20"
          />
        ))}
      </div>
    );
  }

  const pills = (categories ?? []).slice(0, 8);

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      {pills.map(cat => (
        <Link
          key={cat.id}
          to={`/browse?category=${cat.slug}`}
          className="px-3 py-1.5 rounded-full text-sm border border-dark-border bg-dark-surface hover:border-primary/50 hover:text-primary transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
