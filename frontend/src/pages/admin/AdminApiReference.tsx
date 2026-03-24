import { API_BASE_URL } from '../../lib/constants';

const baseUrl = API_BASE_URL || window.location.origin;

function Endpoint({ method, path, description }: { method: string; path: string; description: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/10 text-emerald-400',
    POST: 'bg-blue-500/10 text-blue-400',
    PATCH: 'bg-amber-500/10 text-amber-400',
    DELETE: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${colors[method] ?? 'bg-slate-700 text-slate-300'}`}>
        {method}
      </span>
      <code className="text-xs text-white font-mono shrink-0">{path}</code>
      <span className="text-xs text-slate-500">{description}</span>
    </div>
  );
}

export default function AdminApiReference() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Admin API Reference</h1>
      <p className="text-sm text-slate-400 mb-8">
        All endpoints require <code className="text-primary font-mono text-xs">Authorization: Bearer &lt;token&gt;</code>.
        Base URL: <code className="text-primary font-mono text-xs">{baseUrl}/api</code>
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">Listings</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 divide-y divide-slate-800">
          <Endpoint method="GET" path="/api/admin/listings" description="All listings with status/search filtering" />
          <Endpoint method="GET" path="/api/admin/listings/:id" description="Full listing detail including contact email" />
          <Endpoint method="POST" path="/api/admin/listings" description="Create listing directly (skip pending)" />
          <Endpoint method="PATCH" path="/api/admin/listings/:id" description="Update any field" />
          <Endpoint method="DELETE" path="/api/admin/listings/:id" description="Hard delete" />
          <Endpoint method="POST" path="/api/admin/listings/:id/approve" description="Approve pending submission" />
          <Endpoint method="POST" path="/api/admin/listings/:id/reject" description="Reject with optional note" />
          <Endpoint method="POST" path="/api/admin/listings/:id/toggle-featured" description="Toggle featured flag" />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">Stats & Management</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 divide-y divide-slate-800">
          <Endpoint method="GET" path="/api/admin/stats" description="Dashboard stats" />
          <Endpoint method="POST" path="/api/admin/categories" description="Create new category" />
          <Endpoint method="POST" path="/api/admin/chains" description="Create new chain" />
          <Endpoint method="GET" path="/api/admin/chain-suggestions" description="List pending chain suggestions" />
          <Endpoint method="POST" path="/api/admin/chain-suggestions/:id/approve" description="Approve chain suggestion" />
          <Endpoint method="POST" path="/api/admin/chain-suggestions/:id/reject" description="Reject chain suggestion" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Reputation (Stubbed)</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <Endpoint method="PATCH" path="/api/listings/:id/reputation" description="Set reputation score (0-100) — for future external scoring service" />
        </div>
      </section>
    </div>
  );
}
