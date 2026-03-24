import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAdminStore } from '../../lib/adminStore';
import ListingLogo from '../../components/ListingLogo';
import type { ListingStatus } from '../../types/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-900/30 text-amber-400',
  approved: 'bg-green-900/30 text-green-400',
  rejected: 'bg-red-900/30 text-red-400',
};

const TABS: { label: string; value: ListingStatus | undefined }[] = [
  { label: 'All Submissions', value: undefined },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AdminDashboard() {
  const token = useAdminStore(s => s.token)!;
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const adminSearch = searchParams.get('search') || undefined;
  const [statusFilter, setStatusFilter] = useState<ListingStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionError, setActionError] = useState('');

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.admin.stats(token),
  });

  const { data, isLoading: listingsLoading, error: listingsError } = useQuery({
    queryKey: ['adminListings', statusFilter, adminSearch, page],
    queryFn: () => api.admin.listings.list(token, { status: statusFilter, search: adminSearch, page, per_page: 10 }),
  });

  const listings = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, per_page: 10, total: 0, total_pages: 0 };

  const onMutationError = (err: Error) => {
    setActionError(err.message || 'Action failed. Please try again.');
    setTimeout(() => setActionError(''), 5000);
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.admin.listings.approve(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: onMutationError,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => api.admin.listings.reject(token, id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setRejectTarget(null);
      setRejectNote('');
    },
    onError: onMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.listings.delete(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: onMutationError,
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => api.admin.listings.toggleFeatured(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
    },
    onError: onMutationError,
  });

  // Chain suggestions
  const { data: chainSuggestions } = useQuery({
    queryKey: ['chainSuggestions', 'pending'],
    queryFn: () => api.admin.chainSuggestions.list(token, 'pending'),
  });

  const approveChainMutation = useMutation({
    mutationFn: (id: string) => api.admin.chainSuggestions.approve(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chainSuggestions'] });
    },
    onError: onMutationError,
  });

  const rejectChainMutation = useMutation({
    mutationFn: (id: string) => api.admin.chainSuggestions.reject(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chainSuggestions'] });
    },
    onError: onMutationError,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight mb-2">Submissions Management</h2>
        <p className="text-theme-text-secondary">Review and moderate submissions for the directory: agents, tools, protocols, and infrastructure.</p>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-300 ml-4">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Stats Grid — 3 cards matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-dark-border bg-dark-surface/40 animate-pulse">
              <div className="h-8 w-8 bg-dark-surface rounded-lg mb-4" />
              <div className="h-4 w-20 bg-dark-surface rounded mb-2" />
              <div className="h-8 w-16 bg-dark-surface rounded" />
            </div>
          ))
        ) : statsError ? (
          <div className="col-span-3 p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
            <p className="text-red-400 text-sm">Failed to load stats. Please refresh the page.</p>
          </div>
        ) : stats ? (
          <>
            <div className="p-6 rounded-xl border border-dark-border bg-dark-surface/40">
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">list_alt</span>
              </div>
              <p className="text-theme-text-secondary text-sm font-medium">Total Listings</p>
              <h3 className="text-3xl font-bold">{stats.total.toLocaleString()}</h3>
            </div>
            <div className="p-6 rounded-xl border border-dark-border bg-dark-surface/40">
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg material-symbols-outlined">pending_actions</span>
                {stats.pending > 0 && (
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Action Required</span>
                )}
              </div>
              <p className="text-theme-text-secondary text-sm font-medium">Pending Reviews</p>
              <h3 className="text-3xl font-bold">{stats.pending}</h3>
            </div>
            <div className="p-6 rounded-xl border border-dark-border bg-dark-surface/40">
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg material-symbols-outlined">visibility</span>
              </div>
              <p className="text-theme-text-secondary text-sm font-medium">Total Views</p>
              <h3 className="text-3xl font-bold">
                {stats.total_views >= 1000
                  ? `${(stats.total_views / 1000).toFixed(1)}k`
                  : stats.total_views}
              </h3>
            </div>
          </>
        ) : null}
      </div>

      {/* Submissions Table */}
      <div className="bg-dark-surface/40 rounded-xl border border-dark-border overflow-hidden">
        {/* Tabs */}
        <div className="px-6 py-4 border-b border-dark-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-4">
            {TABS.map(tab => (
              <button
                key={tab.label}
                onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                className={`text-sm pb-4 -mb-[18px] transition-colors ${
                  statusFilter === tab.value
                    ? 'font-bold text-primary border-b-2 border-primary'
                    : 'font-medium text-theme-text-secondary hover:text-theme-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-surface/30 text-theme-text-secondary uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Listing Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">CKB Featured</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {listingsError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-400">
                    Failed to load listings. Please refresh the page.
                  </td>
                </tr>
              ) : listingsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-dark-surface rounded" />
                        <div>
                          <div className="h-4 w-28 bg-dark-surface rounded mb-1" />
                          <div className="h-3 w-20 bg-dark-surface rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-dark-surface rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-dark-surface rounded" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-9 bg-dark-surface rounded-full mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-10 bg-dark-surface rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-dark-surface rounded ml-auto" /></td>
                  </tr>
                ))
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-theme-text-muted">No listings found.</td>
                </tr>
              ) : (
                listings.map(row => (
                  <tr key={row.id} className="hover:bg-dark-surface/20 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/admin/listings/${row.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                        <ListingLogo name={row.name} logoUrl={row.logo_url} size="w-8 h-8" textSize="text-[10px]" rounded="rounded" />
                        <div>
                          <p className="font-bold text-sm">{row.name}</p>
                          <p className="text-[11px] text-theme-text-secondary line-clamp-1">{row.short_description}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary">
                      {new Date(row.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[row.status] ?? ''}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleFeaturedMutation.mutate(row.id)}
                          disabled={toggleFeaturedMutation.isPending}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                            row.is_featured ? 'bg-primary' : 'bg-dark-border'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              row.is_featured ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{row.view_count}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {row.status !== 'approved' && (
                          <button
                            onClick={() => approveMutation.mutate(row.id)}
                            disabled={approveMutation.isPending}
                            className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        <Link to={`/admin/listings/${row.id}`} className="text-xs font-bold text-theme-text-secondary hover:text-theme-text">
                          Edit
                        </Link>
                        {row.status !== 'rejected' ? (
                          <button
                            onClick={() => setRejectTarget({ id: row.id, name: row.name })}
                            className="text-xs font-bold text-red-500 hover:underline"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => { if (confirm('Delete this listing permanently?')) deleteMutation.mutate(row.id); }}
                            disabled={deleteMutation.isPending}
                            className="text-xs font-bold text-theme-text-muted hover:text-red-400 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-dark-border flex items-center justify-between">
          <p className="text-xs text-theme-text-secondary">
            {meta.total > 0
              ? `Showing ${(meta.page - 1) * meta.per_page + 1} to ${Math.min(meta.page * meta.per_page, meta.total)} of ${meta.total} entries`
              : 'No entries'}
          </p>
          {meta.total_pages > 1 && (
            <div className="flex gap-1">
              <button
                disabled={meta.page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1 px-3 border border-dark-border rounded text-xs font-bold hover:bg-dark-surface disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(meta.total_pages, 5) }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`p-1 px-3 rounded text-xs font-bold ${
                    meta.page === i + 1 ? 'bg-primary text-white' : 'border border-dark-border hover:bg-dark-surface'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={meta.page >= meta.total_pages}
                onClick={() => setPage(p => p + 1)}
                className="p-1 px-3 border border-dark-border rounded text-xs font-bold hover:bg-dark-surface disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chain Suggestions */}
      {chainSuggestions && chainSuggestions.length > 0 && (
        <div className="mt-8 bg-dark-surface/40 rounded-xl border border-dark-border overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500">link</span>
              <h3 className="font-bold text-sm">Pending Chain Suggestions</h3>
              <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">{chainSuggestions.length}</span>
            </div>
          </div>
          <div className="divide-y divide-dark-border">
            {chainSuggestions.map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-[11px] text-theme-text-muted">
                    Suggested {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveChainMutation.mutate(s.id)}
                    disabled={approveChainMutation.isPending}
                    className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectChainMutation.mutate(s.id)}
                    disabled={rejectChainMutation.isPending}
                    className="text-xs font-bold text-red-500 hover:underline disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Reject Listing</h3>
            <p className="text-sm text-theme-text-secondary mb-4">
              Rejecting <span className="text-theme-text font-medium">{rejectTarget.name}</span>
            </p>
            <label className="block text-sm text-theme-text-secondary mb-2">Rejection note (optional)</label>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              rows={3}
              placeholder="Reason for rejection..."
              className="w-full bg-dark-surface2 border border-dark-border rounded-lg px-3 py-2 text-sm placeholder:text-theme-text-muted focus:ring-1 focus:ring-primary resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setRejectTarget(null); setRejectNote(''); }}
                className="px-4 py-2 text-sm font-medium text-theme-text-secondary hover:text-theme-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectMutation.mutate({ id: rejectTarget.id, note: rejectNote.trim() || undefined })}
                disabled={rejectMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
