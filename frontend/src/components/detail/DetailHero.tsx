import { Link } from 'react-router-dom';
import type { PublicListing } from '../../types/api';

interface DetailHeroProps {
  listing: PublicListing;
}

/** Logo with gradient fallback for the detail hero section */
function AgentLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-full h-full object-cover"
        onError={e => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.classList.add(
              'bg-gradient-to-br',
              'from-primary/30',
              'to-accent/30',
              'flex',
              'items-center',
              'justify-center',
              'text-3xl',
              'font-bold',
              'text-white',
            );
            parent.textContent = name.charAt(0).toUpperCase();
          }
        }}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-3xl font-bold text-white select-none">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/**
 * Top hero section of the listing detail page.
 * Shows breadcrumbs, logo, name, badges, and conditional action buttons.
 */
export default function DetailHero({ listing }: DetailHeroProps) {
  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
        <Link to="/browse" className="hover:text-white transition-colors">
          Agents
        </Link>
        <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
        <span className="text-white truncate max-w-[200px] sm:max-w-none">{listing.name}</span>
      </nav>

      {/* Hero container */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
          <AgentLogo logoUrl={listing.logo_url} name={listing.name} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{listing.name}</h1>
          <p className="text-lg text-gray-400 mt-2">{listing.short_description}</p>

          {/* Badges row */}
          {(listing.categories.length > 0 || listing.tags.length > 0 || listing.chains.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {listing.categories.map(cat => (
                <span
                  key={cat.id}
                  className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {cat.name}
                </span>
              ))}
              {listing.tags.map(tag => (
                <span
                  key={tag.id}
                  className="text-sm px-3 py-1 rounded-full bg-dark-surface text-gray-300 border border-dark-border"
                >
                  {tag.name}
                </span>
              ))}
              {listing.chains.map(chain => (
                <span
                  key={chain.id}
                  className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
                    chain.is_featured
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-dark-surface text-gray-400 border border-dark-border'
                  }`}
                >
                  {chain.is_featured && (
                    <span className="material-symbols-outlined text-xs leading-none">star</span>
                  )}
                  {chain.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {/* Website — always shown */}
        <a
          href={listing.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(55,19,236,0.4)] active:scale-95 transition-all px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 text-white"
        >
          <span className="material-symbols-outlined text-base leading-none">open_in_new</span>
          Website
        </a>

        {/* GitHub — only if github_url exists */}
        {listing.github_url && (
          <a
            href={listing.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-dark-border hover:border-primary/50 px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors text-white"
          >
            <span className="material-symbols-outlined text-base leading-none">code</span>
            GitHub
          </a>
        )}

        {/* Docs — only if docs_url exists */}
        {listing.docs_url && (
          <a
            href={listing.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-dark-border hover:border-primary/50 px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors text-white"
          >
            <span className="material-symbols-outlined text-base leading-none">description</span>
            Docs
          </a>
        )}

        {/* API Endpoint — only if api_endpoint_url exists */}
        {listing.api_endpoint_url && (
          <a
            href={listing.api_endpoint_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-dark-border hover:border-primary/50 px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors text-white"
          >
            <span className="material-symbols-outlined text-base leading-none">api</span>
            API Endpoint
          </a>
        )}
      </div>
    </div>
  );
}
