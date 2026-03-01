import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { api, ApiError } from '../../lib/api';
import { useAdminStore } from '../../lib/adminStore';
import type { ListingStatus, AdminListing } from '../../types/api';

const STATUS_TABS: { label: string; value: ListingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const toastStyle = { style: { background: '#1d1c27', color: '#fff', border: '1px solid #2b2839' } };

function StatusBadge({ status }: { status: ListingStatus }) {
  const styles: Record<ListingStatus, string> = {
    pending: 'bg-amber-400/20 text-amber-400',
    approved: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminListings() {
  const token = useAdminStore((s) => s.token)!;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const statusParam = searchParams.get('status') as ListingStatus | null;
  const activeStatus = statusParam ?? 'all';

  // Reject modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'listings', activeStatus],
    queryFn: () =>
      api.admin.listings.list(token, {
        status: activeStatus === 'all' ? undefined : activeStatus,
        per_page: 100,
      }),
    staleTime: 1000 * 30,
  });

  function setStatusFilter(value: ListingStatus | 'all') {
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ status: value });
    }
  }

  async function handleApprove(id: string) {
    try {
      await api.admin.listings.approve(token, id);
      toast.success('Listing approved', toastStyle);
      queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Approval failed';
      toast.error(msg, toastStyle);
    }
  }

  async function handleRejectConfirm() {
    if (!rejectingId) return;
    setRejectLoading(true);
    try {
      await api.admin.listings.reject(token, rejectingId, rejectNote.trim() || undefined);
      toast.success('Listing rejected', toastStyle);
      queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      setRejectingId(null);
      setRejectNote('');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Rejection failed';
      toast.error(msg, toastStyle);
    } finally {
      setRejectLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.admin.listings.delete(token, id);
      toast.success('Listing deleted', toastStyle);
      queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Delete failed';
      toast.error(msg, toastStyle);
    }
  }

  const listings: AdminListing[] = data?.data ?? [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Listings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all directory submissions</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-dark-surface border border-dark-border rounded-lg p-1 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeStatus === tab.value
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-400 text-sm">Failed to load listings</div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No listings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{listing.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{listing.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={listing.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(listing.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-white text-right">
                        {listing.view_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {listing.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(listing.id)}
                                title="Approve"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">check</span>
                                Approve
                              </button>
                              <button
                                onClick={() => { setRejectingId(listing.id); setRejectNote(''); }}
                                title="Reject"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => navigate(`/admin/listings/${listing.id}`)}
                            title="Edit"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] text-gray-300 hover:bg-white/[0.08] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id, listing.name)}
                            title="Delete"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-base font-semibold text-white mb-1">Reject Listing</h3>
            <p className="text-sm text-gray-400 mb-4">Optionally provide a rejection note for your records.</p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Rejection reason (optional)"
              rows={3}
              className="w-full bg-dark-bg border border-dark-border focus:border-primary rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none transition-colors text-sm resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setRejectingId(null); setRejectNote(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={rejectLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
              >
                {rejectLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1d1c27', color: '#fff', border: '1px solid #2b2839' },
          error: { iconTheme: { primary: '#f87171', secondary: '#1d1c27' } },
        }}
      />
    </div>
  );
}
