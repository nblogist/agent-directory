import { Link } from 'react-router-dom';
import type { PublicListing } from '../../types/api';

interface ListingCardProps {
  listing: PublicListing;
}

/** Logo with gradient fallback when logo_url is null */
function AgentLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-full h-full object-cover"
        onError={e => {
          // Fallback to gradient on broken URL
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.classList.add('bg-gradient-to-br', 'from-primary/30', 'to-accent/30');
            parent.textContent = name.charAt(0).toUpperCase();
            parent.classList.add('flex', 'items-center', 'justify-center', 'text-xl', 'font-bold', 'text-white');
          }
        }}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xl font-bold text-white select-none">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/**
 * Individual agent listing card with glass-morphism styling.
 * Shows logo, name, description, category/chain badges, tags, and reputation N/A.
 */
export default function ListingCard({ listing }: ListingCardProps) {
  const firstFewTags = listing.tags.slice(0, 3);

  return (
    <Link
      to={`/agents/${listing.slug}`}
      className="block group"
      aria-label={`View ${listing.name}`}
    >
      <div className="glass-card rounded-xl border border-dark-border p-5 hover:border-primary/50 hover:bg-dark-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full flex flex-col">
        {/* Top section: logo + name + description */}
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <AgentLogo logoUrl={listing.logo_url} name={listing.name} />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="font-semibold text-white group-hover:text-primary transition-colors truncate">
              {listing.name}
            </p>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {listing.short_description}
            </p>
          </div>
        </div>

        {/* Badges: categories + chains */}
        {(listing.categories.length > 0 || listing.chains.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {listing.categories.map(cat => (
              <span
                key={cat.id}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {cat.name}
              </span>
            ))}
            {listing.chains.map(chain => (
              <span
                key={chain.id}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  chain.is_featured
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-dark-surface text-gray-400 border border-dark-border'
                }`}
              >
                {chain.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer: tags + reputation */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 mt-auto pt-3">
          <span className="truncate">
            {firstFewTags.length > 0
              ? firstFewTags.map(t => t.name).join(', ')
              : <span>&nbsp;</span>}
          </span>
          <span
            className="shrink-0 ml-2 px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border"
            title="Reputation scoring coming soon"
          >
            N/A
          </span>
        </div>
      </div>
    </Link>
  );
}
