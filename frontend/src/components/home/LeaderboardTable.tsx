import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchListings } from '../../lib/api';

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function AgentLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-10 h-10 rounded-lg object-cover"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-lg font-bold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function LeaderboardTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-agents'],
    queryFn: () => fetchListings({ sort: 'views', per_page: 5 }),
    staleTime: 1000 * 60 * 5,
  });

  const agents = data?.data ?? [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Top AI Agents</h2>

      <div className="rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-surface text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium w-16">Rank</th>
              <th className="text-left px-4 py-3 font-medium">Agent</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium">Views</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Reputation</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-dark-border">
                    <td className="px-4 py-4">
                      <div className="animate-pulse bg-dark-surface rounded h-4 w-6" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-pulse bg-dark-surface rounded-lg w-10 h-10 shrink-0" />
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="animate-pulse bg-dark-surface rounded h-4 w-32" />
                          <div className="animate-pulse bg-dark-surface rounded h-3 w-48" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="animate-pulse bg-dark-surface rounded-full h-5 w-20" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="animate-pulse bg-dark-surface rounded h-4 w-12" />
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="animate-pulse bg-dark-surface rounded h-4 w-8" />
                    </td>
                  </tr>
                ))
              : agents.map((agent, idx) => (
                  <tr
                    key={agent.id}
                    className="border-t border-dark-border hover:bg-dark-surface/50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="px-4 py-4">
                      <span className={idx === 0 ? 'font-bold text-primary' : 'text-gray-400'}>
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Agent */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <AgentLogo logoUrl={agent.logo_url} name={agent.name} />
                        <div className="min-w-0">
                          <Link
                            to={`/agents/${agent.slug}`}
                            className="font-semibold hover:text-primary transition-colors block truncate"
                          >
                            {agent.name}
                          </Link>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {agent.short_description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {agent.categories.length > 0 ? (
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {agent.categories[0].name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">—</span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <span className="material-symbols-outlined text-[16px] text-gray-400" aria-hidden="true">
                          visibility
                        </span>
                        {formatNumber(agent.view_count)}
                      </div>
                    </td>

                    {/* Reputation */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-500">N/A</span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
