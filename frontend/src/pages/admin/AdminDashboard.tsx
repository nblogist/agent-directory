import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAdminStore } from '../../lib/adminStore';

interface StatCardProps {
  label: string;
  value: number | string;
  colorClass: string;
  icon: string;
}

function StatCard({ label, value, colorClass, icon }: StatCardProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className={`material-symbols-outlined text-[24px] ${colorClass}`}>{icon}</span>
        <span className="text-sm font-medium text-gray-400">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${colorClass}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const token = useAdminStore((s) => s.token)!;

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.admin.stats(token),
    staleTime: 1000 * 30, // 30 seconds — stats change frequently
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-surface rounded w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-dark-surface rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-red-400">Failed to load stats. Check your connection and token.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Directory overview and pending review queue</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Listings" value={stats.total} colorClass="text-white" icon="inventory_2" />
        <StatCard label="Pending Review" value={stats.pending} colorClass="text-amber-400" icon="pending" />
        <StatCard label="Approved" value={stats.approved} colorClass="text-emerald-500" icon="check_circle" />
        <StatCard label="Rejected" value={stats.rejected} colorClass="text-red-500" icon="cancel" />
        <StatCard label="Total Views" value={stats.total_views} colorClass="text-primary" icon="visibility" />
      </div>

      {/* Pending queue quick link */}
      {stats.pending > 0 && (
        <div className="mb-8 p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400">notification_important</span>
            <span className="text-amber-200 text-sm font-medium">
              {stats.pending} listing{stats.pending !== 1 ? 's' : ''} awaiting review
            </span>
          </div>
          <Link
            to="/admin/listings?status=pending"
            className="inline-flex items-center gap-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Review now
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Top 5 listings */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-border">
          <h2 className="text-base font-semibold text-white">Top Listings by Views</h2>
        </div>
        {stats.top_listings.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500 text-sm">No approved listings yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {stats.top_listings.map((listing, idx) => (
                <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{listing.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{listing.slug}</td>
                  <td className="px-6 py-4 text-sm text-white text-right font-medium">
                    {listing.view_count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
