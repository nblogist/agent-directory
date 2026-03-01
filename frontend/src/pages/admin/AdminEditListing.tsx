import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { api, ApiError } from '../../lib/api';
import { useAdminStore } from '../../lib/adminStore';
import type { ListingStatus } from '../../types/api';

const toastStyle = { style: { background: '#1d1c27', color: '#fff', border: '1px solid #2b2839' } };
const inputClass = 'w-full bg-dark-bg border border-dark-border focus:border-primary rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none transition-colors text-sm';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';

export default function AdminEditListing() {
  const { id } = useParams<{ id: string }>();
  const token = useAdminStore((s) => s.token)!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [apiEndpointUrl, setApiEndpointUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [status, setStatus] = useState<ListingStatus>('pending');
  const [rejectionNote, setRejectionNote] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['admin', 'listing', id],
    queryFn: () => api.admin.listings.get(token, id!),
    enabled: !!id,
  });

  // Populate form when data loads
  useEffect(() => {
    if (!listing) return;
    setName(listing.name);
    setShortDescription(listing.short_description);
    setDescription(listing.description);
    setLogoUrl(listing.logo_url ?? '');
    setWebsiteUrl(listing.website_url);
    setGithubUrl(listing.github_url ?? '');
    setDocsUrl(listing.docs_url ?? '');
    setApiEndpointUrl(listing.api_endpoint_url ?? '');
    setContactEmail(listing.contact_email);
    setStatus(listing.status);
    setRejectionNote(listing.rejection_note ?? '');
  }, [listing]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await api.admin.listings.update(token, id, {
        name,
        short_description: shortDescription,
        description,
        logo_url: logoUrl || null,
        website_url: websiteUrl,
        github_url: githubUrl || null,
        docs_url: docsUrl || null,
        api_endpoint_url: apiEndpointUrl || null,
        contact_email: contactEmail,
        status,
        rejection_note: status === 'rejected' ? (rejectionNote || null) : null,
      });
      toast.success('Listing saved', toastStyle);
      queryClient.invalidateQueries({ queryKey: ['admin', 'listing', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Save failed';
      toast.error(msg, toastStyle);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-dark-surface rounded w-64" />
          <div className="h-96 bg-dark-surface rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-red-400">Failed to load listing. It may have been deleted.</p>
        <button
          onClick={() => navigate('/admin/listings')}
          className="mt-4 text-primary text-sm hover:underline"
        >
          Back to listings
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/listings')}
          className="text-gray-400 hover:text-white transition-colors"
          title="Back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Edit Listing</h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{listing.slug}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Status field */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Status</h2>
          <div>
            <label className={labelClass}>Listing Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className={inputClass}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {status === 'rejected' && (
            <div className="mt-4">
              <label className={labelClass}>Rejection Note</label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Optional rejection reason"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          )}
        </div>

        {/* Basic info */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">Basic Information</h2>

          <div>
            <label className={labelClass}>Agent Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Short Description</label>
            <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Website URL</label>
            <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} type="url" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Logo URL</label>
            <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} type="url" placeholder="Optional" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Contact Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" className={inputClass} />
          </div>
        </div>

        {/* Details */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white mb-2">Details</h2>

          <div>
            <label className={labelClass}>Description (Markdown)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label className={labelClass}>GitHub URL</label>
            <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} type="url" placeholder="Optional" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Documentation URL</label>
            <input value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} type="url" placeholder="Optional" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>API Endpoint URL</label>
            <input value={apiEndpointUrl} onChange={(e) => setApiEndpointUrl(e.target.value)} type="url" placeholder="Optional" className={inputClass} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/listings')}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

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
